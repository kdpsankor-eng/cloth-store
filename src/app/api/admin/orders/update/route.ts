import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId, newStatus, courierName, trackingCode, adminNotes } = await req.json();

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: "অর্ডার আইডি ও নতুন স্ট্যাটাস আবশ্যক।" },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: newStatus,
          courierName: courierName || undefined,
          trackingCode: trackingCode || undefined,
          statusHistory: {
            create: {
              status: newStatus,
              notes: adminNotes || `স্ট্যাটাস পরিবর্তন করে "${newStatus}" করা হয়েছে।`,
              changedBy: "Admin Portal",
            },
          },
        },
      });

      return order;
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error("Failed to update order:", err);
    return NextResponse.json(
      { error: "অর্ডার আপডেট করতে ত্রুটি হয়েছে।" },
      { status: 500 }
    );
  }
}
