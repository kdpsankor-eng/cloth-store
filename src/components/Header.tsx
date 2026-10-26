"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Truck, Phone, Menu, X, ChevronRight, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  categories?: Array<{ id: string; name: string; nameBn: string; slug: string }>;
  announcement?: string;
  phone?: string;
  siteName?: string;
}

export default function Header({
  categories = [
    { id: "1", name: "Panjabi Collection", nameBn: "পাঞ্জাবী", slug: "panjabi" },
    { id: "2", name: "Burqa Fabrics", nameBn: "বোরকা কাপড়", slug: "burqa-fabric" },
    { id: "3", name: "Salwar Kameez Fabrics", nameBn: "সালোয়ার কামিজ কাপড়", slug: "salwar-kameez" },
  ],
  announcement = "✨ সারা দেশে দ্রুততম ক্যাশ অন ডেলিভারি | অগ্রিম কোনো টাকা ছাড়াই ঘরে বসে অর্ডার করুন!",
  phone = "01712-345678",
  siteName = "অরণ্যা ফ্যাশন",
}: HeaderProps) {
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#762A43] text-[#F7F0E8] text-xs py-2 px-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="font-medium truncate flex-1 text-center sm:text-left">
            {announcement}
          </p>
          <div className="hidden sm:flex items-center gap-4 text-xs shrink-0 font-medium">
            <Link
              href="/track-order"
              className="flex items-center gap-1.5 hover:text-[#C5A46D] transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>অর্ডার ট্র্যাক করুন</span>
            </Link>
            <span className="opacity-40">|</span>
            <a
              href={`tel:${phone.replace(/[^0-9]/g, "")}`}
              className="flex items-center gap-1.5 hover:text-[#C5A46D] transition-colors tabular-nums"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="মেনু খুলুন"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-[#762A43] flex items-center justify-center text-white font-serif text-lg font-bold shadow-xs group-hover:bg-[#5E2034] transition-colors">
              অ
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#762A43] font-serif">
                {siteName}
              </span>
              <span className="block text-[10px] tracking-wider text-[#C5A46D] uppercase font-medium">
                Premium Fashion
              </span>
            </div>
          </Link>

          {/* Search Input (Desktop & Tablet) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-6 relative"
          >
            <input
              type="text"
              placeholder="পণ্য বা ক্যাটাগরি খুঁজুন (যেমন: পাঞ্জাবী, বোরকা কাপড়, কটন থ্রি-পিস)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-[#F8F9FA] border border-gray-200 rounded-full text-sm text-[#252525] placeholder:text-gray-400 focus:outline-hidden focus:border-[#762A43] focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#762A43] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Actions: Track & Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/track-order"
              className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#762A43] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Truck className="w-4 h-4 text-[#762A43]" />
              <span>ট্র্যাকিং</span>
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-[#F7F0E8] hover:bg-[#ebdccf] text-[#762A43] px-3.5 py-2.5 rounded-full font-medium transition-all group shadow-xs"
              aria-label="শপিং কার্ট"
            >
              <ShoppingBag className="w-5 h-5 text-[#762A43] group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold tabular-nums">
                {itemCount}
              </span>
              <span className="hidden sm:inline text-xs font-semibold">
                ব্যাগ
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (underneath) */}
        <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden relative">
          <input
            type="text"
            placeholder="পণ্য খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3.5 pr-9 py-2 bg-[#F8F9FA] border border-gray-200 rounded-lg text-xs text-[#252525] focus:outline-hidden focus:border-[#762A43] transition-all"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. Desktop Category Navigation Menu */}
      <nav className="hidden lg:block border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-8 py-2.5 text-sm font-medium text-gray-700">
            <li>
              <Link
                href="/"
                className="hover:text-[#762A43] py-1 border-b-2 border-transparent hover:border-[#762A43] transition-all"
              >
                হোম
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="hover:text-[#762A43] py-1 border-b-2 border-transparent hover:border-[#762A43] transition-all"
                >
                  {cat.nameBn || cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/products?filter=offers"
                className="text-[#762A43] font-semibold py-1 border-b-2 border-transparent hover:border-[#762A43] transition-all flex items-center gap-1"
              >
                <span>স্পেশাল অফার</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* 4. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-xl flex flex-col p-5 z-50">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-lg font-bold text-[#762A43] font-serif">
                {siteName}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-[#F7F0E8] hover:text-[#762A43] transition-colors"
              >
                <span>হোমপেজ</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-[#F7F0E8] hover:text-[#762A43] transition-colors"
                >
                  <span>{cat.nameBn || cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Truck className="w-4 h-4 text-[#762A43]" />
                  <span>অর্ডার ট্র্যাকিং</span>
                </Link>
                <a
                  href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium text-[#762A43] bg-[#F7F0E8]"
                >
                  <Phone className="w-4 h-4" />
                  <span>সরাসরি কল: {phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
