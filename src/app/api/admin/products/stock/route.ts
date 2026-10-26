import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { variantId, stockQuantity } = await req.json();

    if (!variantId || stockQuantity === undefined) {
      return NextResponse.json({ error: "ভ্যারিয়েন্ট আইডি ও স্টক আবশ্যক।" }, { status: 400 });
    }

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity: parseInt(stockQuantity, 10) },
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (err) {
    console.error("Stock update error:", err);
    return NextResponse.json({ error: "স্টক আপডেট ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}
