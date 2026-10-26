"use client";

import React, { useState } from "react";
import { Save, CheckCircle2, Loader2, Truck, Store, Phone, Megaphone, Image as ImageIcon } from "lucide-react";

interface AdminSettingsClientProps {
  initialSettings: Record<string, string>;
}

export default function AdminSettingsClient({
  initialSettings,
}: AdminSettingsClientProps) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState("");

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        setToast("সকল সেটিংস সফলভাবে সেভ হয়েছে এবং ওয়েবসাইটে কার্যকর হয়েছে!");
        setTimeout(() => setToast(""), 4000);
      } else {
        alert("সেটিংস সেভ করতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      alert("সার্ভার এরর। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold font-serif text-[#252525]">
          ডেলিভারি চার্জ ও স্টোর সেটিংস
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          এখানে করা যেকোনো পরিবর্তন সরাসরি চেকআউট এবং ওয়েবসাইটে রিয়েল-টাইমে আপডেট হবে।
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Delivery Charge Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#252525] flex items-center gap-2 pb-3 border-b border-gray-100">
            <Truck className="w-5 h-5 text-[#762A43]" />
            <span>ডেলিভারি চার্জ কনফিগারেশন (বাংলাদেশ)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                ঢাকার ভেতরের ডেলিভারি চার্জ (টাকা) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={settings["delivery_inside_dhaka"] || "80"}
                  onChange={(e) => handleChange("delivery_inside_dhaka", e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold tabular-nums text-[#762A43] focus:outline-hidden focus:border-[#762A43]"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                  ৳
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                গ্রাহক "ঢাকার ভেতরে" সিলেক্ট করলে এই ফি যোগ হবে।
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                ঢাকার বাইরের ডেলিভারি চার্জ (টাকা) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={settings["delivery_outside_dhaka"] || "150"}
                  onChange={(e) => handleChange("delivery_outside_dhaka", e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold tabular-nums text-[#762A43] focus:outline-hidden focus:border-[#762A43]"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                  ৳
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                গ্রাহক "ঢাকার বাইরে" সিলেক্ট করলে এই ফি যোগ হবে।
              </p>
            </div>
          </div>
        </div>

        {/* 2. Store Identity Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#252525] flex items-center gap-2 pb-3 border-b border-gray-100">
            <Store className="w-5 h-5 text-[#762A43]" />
            <span>ব্র্যান্ড পরিচিতি ও যোগাযোগের তথ্য</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                ওয়েবসাইটের নাম (ব্র্যান্ড)
              </label>
              <input
                type="text"
                value={settings["site_name"] || ""}
                onChange={(e) => handleChange("site_name", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm text-[#252525] focus:outline-hidden focus:border-[#762A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                ট্যাগলাইন
              </label>
              <input
                type="text"
                value={settings["site_tagline"] || ""}
                onChange={(e) => handleChange("site_tagline", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm text-[#252525] focus:outline-hidden focus:border-[#762A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                সাপোর্ট ফোন নাম্বার
              </label>
              <input
                type="text"
                value={settings["site_phone"] || ""}
                onChange={(e) => handleChange("site_phone", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm tabular-nums text-[#252525] focus:outline-hidden focus:border-[#762A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                হোয়াটসঅ্যাপ নাম্বার
              </label>
              <input
                type="text"
                value={settings["site_whatsapp"] || ""}
                onChange={(e) => handleChange("site_whatsapp", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm tabular-nums text-[#252525] focus:outline-hidden focus:border-[#762A43]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                শোরুম বা অফিসের ঠিকানা
              </label>
              <input
                type="text"
                value={settings["site_address"] || ""}
                onChange={(e) => handleChange("site_address", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm text-[#252525] focus:outline-hidden focus:border-[#762A43]"
              />
            </div>
          </div>
        </div>

        {/* 3. Homepage CMS Banners */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#252525] flex items-center gap-2 pb-3 border-b border-gray-100">
            <Megaphone className="w-5 h-5 text-[#762A43]" />
            <span>হোমপেজ ব্যানার ও নোটিশ বার</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                টপ নোটিশ বার টেক্সট
              </label>
              <input
                type="text"
                value={settings["announcement_bn"] || ""}
                onChange={(e) => handleChange("announcement_bn", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm text-[#252525] focus:outline-hidden focus:border-[#762A43]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  হিরো ব্যানার হেডলাইন
                </label>
                <input
                  type="text"
                  value={settings["hero_title"] || ""}
                  onChange={(e) => handleChange("hero_title", e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm text-[#252525] focus:outline-hidden focus:border-[#762A43]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  হিরো ব্যানার সাবটাইটেল
                </label>
                <input
                  type="text"
                  value={settings["hero_subtitle"] || ""}
                  onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm text-[#252525] focus:outline-hidden focus:border-[#762A43]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                হিরো ব্যানার ইমেজ লিংক (URL)
              </label>
              <input
                type="text"
                value={settings["hero_banner_image"] || ""}
                onChange={(e) => handleChange("hero_banner_image", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono text-[#252525] focus:outline-hidden focus:border-[#762A43]"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xl bg-[#762A43] hover:bg-[#5E2034] text-white font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>সেটিংস সেভ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>সকল সেটিংস সেভ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
