import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, MapPin, Truck, ShieldCheck, RefreshCw } from "lucide-react";

interface FooterProps {
  siteName?: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
}

export default function Footer({
  siteName = "অরণ্যা ফ্যাশন",
  tagline = "প্রিমিয়াম ওম্যানস ফ্যাশন ওয়্যার হাউস",
  phone = "01712-345678",
  whatsapp = "01712-345678",
  address = "ধানমন্ডি, ঢাকা - ১২০৯, বাংলাদেশ",
}: FooterProps) {
  return (
    <footer className="bg-[#252525] text-white pt-14 pb-8 border-t-4 border-[#C5A46D]">
      {/* 1. Value Badges Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white/5">
            <Truck className="w-6 h-6 text-[#C5A46D]" />
            <h4 className="text-sm font-semibold">সারা দেশে হোম ডেলিভারি</h4>
            <p className="text-xs text-gray-400">ঢাকার ভেতর ২৪-৪৮ ঘণ্টা, বাইরে ৭২ ঘণ্টা</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white/5">
            <ShieldCheck className="w-6 h-6 text-[#C5A46D]" />
            <h4 className="text-sm font-semibold">ক্যাশ অন ডেলিভারি</h4>
            <p className="text-xs text-gray-400">পণ্য হাতে পেয়ে মূল্য পরিশোধের সুবিধা</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white/5">
            <RefreshCw className="w-6 h-6 text-[#C5A46D]" />
            <h4 className="text-sm font-semibold">সহজ এক্সচেঞ্জ পলিসি</h4>
            <p className="text-xs text-gray-400">সাইজ বা ত্রুটিতে দ্রুত পরিবর্তন সুবিধা</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white/5">
            <MessageCircle className="w-6 h-6 text-[#C5A46D]" />
            <h4 className="text-sm font-semibold">লাইভ কাস্টমার সাপোর্ট</h4>
            <p className="text-xs text-gray-400">সকাল ১০টা থেকে রাত ১০টা পর্যন্ত</p>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#762A43] flex items-center justify-center text-white font-serif font-bold">
              অ
            </div>
            <span className="text-xl font-bold font-serif text-[#F7F0E8]">{siteName}</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {tagline}। আধুনিক ডিজাইন, উন্নত ফেব্রিক্স ও নিখুঁত ফিনিশিং নিয়ে আপনার পছন্দের বিশ্বস্ত অনলাইন শপ।
          </p>
          <div className="pt-2 space-y-2 text-xs text-gray-300">
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" />
              <span>{phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span>হোয়াটসঅ্যাপ: {whatsapp}</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
              <span>{address}</span>
            </p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-semibold text-[#F7F0E8] uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            জনপ্রিয় ক্যাটাগরি
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <Link href="/category/panjabi" className="hover:text-[#C5A46D] transition-colors">
                পাঞ্জাবী কালেকশন
              </Link>
            </li>
            <li>
              <Link href="/category/burqa-fabric" className="hover:text-[#C5A46D] transition-colors">
                বোরকা কাপড় ও ফেব্রিক
              </Link>
            </li>
            <li>
              <Link href="/category/salwar-kameez" className="hover:text-[#C5A46D] transition-colors">
                সালোয়ার কামিজ কাপড় (থ্রি-পিস)
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-[#C5A46D] transition-colors">
                সবগুলো পণ্য কালেকশন
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-sm font-semibold text-[#F7F0E8] uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            গ্রাহক সেবা ও তথ্য
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <Link href="/track-order" className="hover:text-[#C5A46D] transition-colors font-medium text-white flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>অর্ডার ট্র্যাক করুন</span>
              </Link>
            </li>
            <li>
              <Link href="/policy/delivery" className="hover:text-[#C5A46D] transition-colors">
                ডেলিভারি চার্জ ও সময়সীমা
              </Link>
            </li>
            <li>
              <Link href="/policy/return" className="hover:text-[#C5A46D] transition-colors">
                রিটার্ন ও এক্সচেঞ্জ পলিসি
              </Link>
            </li>
            <li>
              <Link href="/policy/privacy" className="hover:text-[#C5A46D] transition-colors">
                গোপনীয়তা ও নিরাপত্তা
              </Link>
            </li>
            <li>
              <Link href="/policy/terms" className="hover:text-[#C5A46D] transition-colors">
                শর্তাবলী ও নিয়মাবলী
              </Link>
            </li>
          </ul>
        </div>

        {/* Trust Badges / Admin Link */}
        <div>
          <h4 className="text-sm font-semibold text-[#F7F0E8] uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            পেমেন্ট ও কুরিয়ার
          </h4>
          <p className="text-xs text-gray-400 mb-3">
            আমরা বিশ্বস্ত কুরিয়ার পার্টনারদের মাধ্যমে সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারিতে পণ্য পৌঁছে দেই।
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-300">
            <span className="px-2 py-1 rounded bg-white/10 font-medium">ক্যাশ অন ডেলিভারি</span>
            <span className="px-2 py-1 rounded bg-white/10 font-medium">Steadfast</span>
            <span className="px-2 py-1 rounded bg-white/10 font-medium">Pathao</span>
            <span className="px-2 py-1 rounded bg-white/10 font-medium">RedX</span>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800">
            <Link
              href="/admin/login"
              className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
            >
              🔒 অ্যাডমিন লগইন
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>© ২০২৬ {siteName}। সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
}
