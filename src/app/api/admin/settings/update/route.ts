import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { settings } = await req.json(); // Record<string, string>

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "অবৈধ ডাটা ফরম্যাট।" }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update settings:", err);
    return NextResponse.json(
      { error: "সেটিংস আপডেট করতে ত্রুটি হয়েছে।" },
      { status: 500 }
    );
  }
}
