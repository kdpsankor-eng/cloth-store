import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderNumber, phone } = await req.json();

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { error: "অর্ডার নাম্বার এবং মোবাইল নাম্বার উভয় তথ্যই আবশ্যক।" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, "");

    // Exact match verification for security & privacy
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber.trim(),
        customerPhone: {
          endsWith: cleanPhone.slice(-10), // Safe match for with or without +88 / 0
        },
      },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "প্রদত্ত অর্ডার নাম্বার বা মোবাইল নাম্বারের সাথে কোনো অর্ডারের মিল পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        deliveryAddress: order.deliveryAddress,
        orderStatus: order.orderStatus,
        totalPayable: order.totalPayable,
        paymentMethod: order.paymentMethod,
        courierName: order.courierName,
        trackingCode: order.trackingCode,
        createdAt: order.createdAt,
        items: order.items,
        statusHistory: order.statusHistory,
      },
    });
  } catch (err) {
    console.error("Order tracking error:", err);
    return NextResponse.json(
      { error: "অর্ডার ট্র্যাক করতে একটি অভ্যন্তরীণ ত্রুটি হয়েছে।" },
      { status: 500 }
    );
  }
}
