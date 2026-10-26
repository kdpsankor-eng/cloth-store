import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function ReturnPolicyPage() {
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
            রিটার্ন ও এক্সচেঞ্জ পলিসি
          </h1>
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <p>
              আমরা চাই আপনার শপিং অভিজ্ঞতা হোক ১০০% নির্ভেজাল ও সন্তোষজনক। যদি কোনো কারণে আপনার অর্ডারকৃত পোশাকে কোনো সাইজ সমস্যা বা ত্রুটি থাকে, তবে আমরা অতি দ্রুত এক্সচেঞ্জের ব্যবস্থা করে থাকি।
            </p>

            <h3 className="text-base font-bold text-[#252525] pt-2">এক্সচেঞ্জের শর্তাবলী:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>ডেলিভারি ম্যান উপস্থিত থাকা অবস্থায় পার্সেলটি চেক করুন।</li>
              <li>সাইজে অমিল হলে বা ফেব্রিকে ত্রুটি থাকলে সাথে সাথে আমাদের হটলাইনে ({settingsMap["site_phone"]}) কল করে জানান।</li>
              <li>পণ্যটি অব্যবহৃত এবং মূল ট্যাগসহ অক্ষত অবস্থায় ফেরত দিতে হবে।</li>
              <li>অভিযোগ গ্রহণের ৪৮ ঘণ্টার মধ্যে নতুন সাইজের পোশাক পাঠিয়ে দেওয়া হবে।</li>
            </ul>

            <h3 className="text-base font-bold text-[#252525] pt-2">সহায়তার জন্য যোগাযোগ:</h3>
            <p>
              যেকোনো প্রয়োজনে আমাদের সাপোর্ট হেল্পলাইনে সরাসরি ফোন করতে পারেন: <strong>{settingsMap["site_phone"]}</strong> অথবা হোয়াটসঅ্যাপে মেসেজ পাঠান: <strong>{settingsMap["site_whatsapp"]}</strong>।
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
