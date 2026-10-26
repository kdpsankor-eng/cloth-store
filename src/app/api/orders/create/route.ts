import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryZone, // "INSIDE_DHAKA" or "OUTSIDE_DHAKA"
      orderNotes,
      items, // [{ productId, variantId, quantity }]
    } = body;

    // 1. Validation
    if (!customerName || customerName.trim().length < 2) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে আপনার সঠিক নাম লিখুন।" },
        { status: 400 }
      );
    }

    const cleanPhone = customerPhone?.trim()?.replace(/[\s-]/g, "");
    const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!cleanPhone || !bdPhoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)।" },
        { status: 400 }
      );
    }

    if (!deliveryAddress || deliveryAddress.trim().length < 6) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে আপনার পূর্ণাঙ্গ ডেলিভারি ঠিকানা প্রদান করুন।" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "আপনার শপিং ব্যাগে কোনো পণ্য নেই।" },
        { status: 400 }
      );
    }

    // 2. Fetch official delivery charges from site_settings (Server Truth)
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: { in: ["delivery_inside_dhaka", "delivery_outside_dhaka"] },
      },
    });

    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const insideDhakaFee = parseFloat(settingsMap["delivery_inside_dhaka"] || "80");
    const outsideDhakaFee = parseFloat(settingsMap["delivery_outside_dhaka"] || "150");

    const deliveryFee =
      deliveryZone === "OUTSIDE_DHAKA" ? outsideDhakaFee : insideDhakaFee;

    // 3. Verify products, variants and calculate official subtotal
    let subtotal = 0;
    const orderItemsToCreate: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `দুঃখিত, পণ্যটি বর্তমানে উপলব্ধ নেই।` },
          { status: 400 }
        );
      }

      let unitPrice =
        product.salePrice && product.salePrice > 0
          ? product.salePrice
          : product.regularPrice;

      let variantSnapshot = null;
      let variantRecord = null;

      if (item.variantId) {
        variantRecord = product.variants.find((v) => v.id === item.variantId);
        if (!variantRecord || !variantRecord.isActive) {
          return NextResponse.json(
            { error: `সিলেক্টেড সাইজ/ভ্যারিয়েন্টটি আর স্টক-এ নেই।` },
            { status: 400 }
          );
        }

        if (variantRecord.stockQuantity < item.quantity) {
          return NextResponse.json(
            {
              error: `দুঃখিত, "${product.nameBn}" এর পর্যাপ্ত স্টক নেই (মজুদ: ${variantRecord.stockQuantity}টি)।`,
            },
            { status: 400 }
          );
        }

        unitPrice += variantRecord.priceAdjustment || 0;
        variantSnapshot = `${variantRecord.size || ""}${variantRecord.color ? " - " + variantRecord.color : ""}`.trim();
      }

      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItemsToCreate.push({
        productId: product.id,
        variantId: variantRecord?.id || null,
        productNameSnapshot: product.nameBn || product.name,
        variantNameSnapshot: variantSnapshot || "Free Size",
        unitPriceSnapshot: unitPrice,
        quantity: item.quantity,
        lineTotal,
      });
    }

    const grandTotal = subtotal + deliveryFee;

    // 4. Generate clean human-readable order number (e.g. WCS-261024-7492)
    const now = new Date();
    const dateStr = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `WCS-${dateStr}-${randomSuffix}`;

    // 5. ACID Transaction to save Order, OrderItems, StatusHistory & update inventory
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          deliveryAddress: deliveryAddress.trim(),
          deliveryZone: deliveryZone === "OUTSIDE_DHAKA" ? "OUTSIDE_DHAKA" : "INSIDE_DHAKA",
          orderNotes: orderNotes?.trim() || null,
          subtotal,
          deliveryCharge: deliveryFee,
          discountAmount: 0.0,
          totalPayable: grandTotal,
          orderStatus: "PENDING",
          paymentMethod: "CASH_ON_DELIVERY",
          paymentStatus: "UNPAID",
          items: {
            create: orderItemsToCreate,
          },
          statusHistory: {
            create: {
              status: "PENDING",
              notes: "গ্রাহক ক্যাশ অন ডেলিভারিতে অর্ডার সম্পন্ন করেছেন।",
              changedBy: "Customer Web Checkout",
            },
          },
        },
      });

      // Decrement inventory for variant items
      for (const item of items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return order;
    });

    return NextResponse.json({
      success: true,
      orderNumber: createdOrder.orderNumber,
      orderId: createdOrder.id,
    });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "অর্ডার প্রসেস করতে একটি সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
