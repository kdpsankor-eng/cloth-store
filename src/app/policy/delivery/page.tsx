import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function DeliveryPolicyPage() {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true } }),
    prisma.siteSetting.findMany(),
  ]);

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        categories={categories}
        announcement={settingsMap["announcement_bn"]}
        phone={settingsMap["site_phone"]}
        siteName={settingsMap["site_name"]}
      />

      <main className="flex-1 py-12 bg-[#F8F9FA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#762A43]">
            ডেলিভারি পলিসি ও চার্জ
          </h1>
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <p>
              আমাদের সম্মানিত গ্রাহকদের সুবিধার্থে আমরা সারা বাংলাদেশে দ্রুততম হোম ডেলিভারি সেবা প্রদান করে থাকি।
            </p>

            <h3 className="text-base font-bold text-[#252525] pt-2">ডেলিভারি সময়সীমা:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>ঢাকার ভেতরে:</strong> অর্ডার নিশ্চিত করার ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়।</li>
              <li><strong>ঢাকার বাইরে (সমগ্র বাংলাদেশ):</strong> অর্ডার নিশ্চিত করার ৪৮ থেকে ৭২ ঘণ্টার মধ্যে কুরিয়ারের মাধ্যমে হোম ডেলিভারি করা হয়।</li>
            </ul>

            <h3 className="text-base font-bold text-[#252525] pt-2">ডেলিভারি চার্জ:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>ঢাকার ভেতরে ডেলিভারি চার্জ: <strong>৳ {settingsMap["delivery_inside_dhaka"] || "৮০"}</strong></li>
              <li>ঢাকার বাইরে ডেলিভারি চার্জ: <strong>৳ {settingsMap["delivery_outside_dhaka"] || "১৫০"}</strong></li>
            </ul>

            <h3 className="text-base font-bold text-[#252525] pt-2">ক্যাশ অন ডেলিভারি সুবিধা:</h3>
            <p>
              অর্ডার করার সময় গ্রাহককে কোনো অগ্রিম টাকা পরিশোধ করতে হয় না। কুরিয়ার পার্সেল নিয়ে পৌঁছালে পণ্য দেখে সম্পূর্ণ মূল্য পরিশোধ করার সুবিধা রয়েছে।
            </p>
          </div>
        </div>
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
