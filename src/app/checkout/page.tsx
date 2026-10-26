import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutClient from "@/components/CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.siteSetting.findMany(),
  ]);

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const insideDhakaFee = parseFloat(settingsMap["delivery_inside_dhaka"] || "80");
  const outsideDhakaFee = parseFloat(settingsMap["delivery_outside_dhaka"] || "150");

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header
        categories={categories}
        announcement={settingsMap["announcement_bn"]}
        phone={settingsMap["site_phone"]}
        siteName={settingsMap["site_name"]}
      />

      <main className="flex-1">
        <CheckoutClient
          insideDhakaFee={insideDhakaFee}
          outsideDhakaFee={outsideDhakaFee}
          sitePhone={settingsMap["site_phone"] || "01712-345678"}
        />
      </main>

      <Footer
        siteName={settingsMap["site_name"]}
        tagline={settingsMap["site_tagline"]}
        phone={settingsMap["site_phone"]}
        whatsapp={settingsMap["site_whatsapp"]}
        address={settingsMap["site_address"]}
      />
    </div>
  );
}
