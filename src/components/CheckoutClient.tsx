"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  User,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CheckoutClientProps {
  insideDhakaFee: number;
  outsideDhakaFee: number;
  sitePhone: string;
}

export default function CheckoutClient({
  insideDhakaFee = 80,
  outsideDhakaFee = 150,
  sitePhone = "01712-345678",
}: CheckoutClientProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<"INSIDE_DHAKA" | "OUTSIDE_DHAKA">("INSIDE_DHAKA");
  const [orderNotes, setOrderNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const deliveryCharge = deliveryZone === "INSIDE_DHAKA" ? insideDhakaFee : outsideDhakaFee;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার নাম প্রদান করুন।");
      return;
    }

    const cleanPhone = customerPhone.trim().replace(/[\s-]/g, "");
    const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanPhone)) {
      setErrorMessage("অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নাম্বার লিখুন (যেমন: 017XXXXXXXX)।");
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 6) {
      setErrorMessage("অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা বিস্তারিতভাবে লিখুন।");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("আপনার শপিং ব্যাগটি খালি। অন্তত একটি পোশাক যুক্ত করুন।");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone: cleanPhone,
          deliveryAddress,
          deliveryZone,
          orderNotes,
          items: items.map((it) => ({
            productId: it.productId,
            variantId: it.variantId || null,
            quantity: it.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "অর্ডারটি প্রসেস করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
        setIsLoading(false);
        return;
      }

      // Order created successfully!
      clearCart();
      router.push(`/order-success/${data.orderNumber}`);
    } catch (err) {
      console.error(err);
      setErrorMessage("সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন।");
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F7F0E8] text-[#762A43] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 opacity-70" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-[#252525]">
          আপনার শপিং ব্যাগটি খালি
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          অর্ডার সম্পন্ন করতে প্রথমে আপনার পছন্দের পোশাকটি কার্টে যোগ করুন।
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#762A43] text-white text-sm font-semibold hover:bg-[#5E2034] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কালেকশন দেখুন</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#252525]">
          সহজ ক্যাশ অন ডেলিভারি চেকআউট
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          কোনো অগ্রিম পেমেন্ট ছাড়াই অর্ডার নিশ্চিত করুন, পণ্য হাতে পেয়ে মূল্য পরিশোধ করবেন।
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Customer Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Delivery Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-[#252525] flex items-center gap-2 pb-3 border-b border-gray-100">
                <MapPin className="w-5 h-5 text-[#762A43]" />
                <span>ডেলিভারি তথ্য প্রদান করুন</span>
              </h2>

              {/* 1. Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  আপনার সম্পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="যেমন: রাবেয়া সুলতানা"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm text-[#252525] focus:outline-hidden focus:border-[#762A43] focus:ring-1 focus:ring-[#762A43] transition-all"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* 2. Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  সচল মোবাইল নাম্বার <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 01712345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm text-[#252525] tabular-nums focus:outline-hidden focus:border-[#762A43] focus:ring-1 focus:ring-[#762A43] transition-all"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  * ডেলিভারিম্যান এই নাম্বারে কল করে পণ্য পৌঁছে দিবেন।
                </p>
              </div>

              {/* 3. Delivery Zone Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  ডেলিভারি এলাকা নির্বাচন করুন <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryZone === "INSIDE_DHAKA"
                        ? "border-[#762A43] bg-[#F7F0E8]/40"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={deliveryZone === "INSIDE_DHAKA"}
                        onChange={() => setDeliveryZone("INSIDE_DHAKA")}
                        className="text-[#762A43] focus:ring-[#762A43]"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#252525] block">
                          ঢাকার ভেতরে
                        </span>
                        <span className="text-[11px] text-gray-500">২৪-৪৮ ঘণ্টা সময়</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#762A43] tabular-nums">
                      ৳ {insideDhakaFee}
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryZone === "OUTSIDE_DHAKA"
                        ? "border-[#762A43] bg-[#F7F0E8]/40"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={deliveryZone === "OUTSIDE_DHAKA"}
                        onChange={() => setDeliveryZone("OUTSIDE_DHAKA")}
                        className="text-[#762A43] focus:ring-[#762A43]"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#252525] block">
                          ঢাকার বাইরে (সমগ্র বাংলাদেশ)
                        </span>
                        <span className="text-[11px] text-gray-500">৪৮-৭২ ঘণ্টা সময়</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#762A43] tabular-nums">
                      ৳ {outsideDhakaFee}
                    </span>
                  </label>
                </div>
              </div>

              {/* 4. Complete Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    required
                    placeholder="বাসা নং, রোড নং, এলাকা/মহল্লা, থানা ও জেলা উল্লেখ করুন..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm text-[#252525] focus:outline-hidden focus:border-[#762A43] focus:ring-1 focus:ring-[#762A43] transition-all"
                  />
                </div>
              </div>

              {/* 5. Additional Order Notes (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="যেমন: বিকাল ৪টার পরে ডেলিভারি দিলে ভালো হয়"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-xs text-[#252525] focus:outline-hidden focus:border-[#762A43] transition-all"
                  />
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="p-4 rounded-xl bg-white border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F7F0E8] text-[#762A43] flex items-center justify-center font-bold">
                  ৳
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#252525]">ক্যাশ অন ডেলিভারি (COD)</h4>
                  <p className="text-xs text-gray-500">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-green-700 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>সক্রিয়</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-md sticky top-24 space-y-6">
              <h2 className="text-base font-bold text-[#252525] pb-3 border-b border-gray-100 flex items-center justify-between">
                <span>আপনার অর্ডার সারাংশ</span>
                <span className="text-xs font-semibold text-[#762A43]">
                  {items.length}টি আইটেম
                </span>
              </h2>

              {/* Items List */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div
                    key={`${it.productId}-${it.variantId || "default"}`}
                    className="flex gap-3 items-center py-2 border-b border-gray-50 last:border-none"
                  >
                    <div className="relative w-14 h-16 rounded-md overflow-hidden bg-gray-50 shrink-0">
                      <Image
                        src={it.imageUrl}
                        alt={it.nameBn || it.name}
                        fill
                        className="object-cover"
                        sizes="60px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#252525] truncate">
                        {it.nameBn || it.name}
                      </h4>
                      <div className="flex gap-2 text-[11px] text-gray-500 mt-0.5">
                        {it.size && <span>সাইজ: {it.size}</span>}
                        <span>পরিমাণ: {it.quantity}টি</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[#762A43] tabular-nums shrink-0">
                      ৳ {(it.price * it.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>পোশাকের মূল্য (সাবটোটাল):</span>
                  <span className="font-semibold tabular-nums text-gray-900">
                    ৳ {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ ({deliveryZone === "INSIDE_DHAKA" ? "ঢাকা" : "ঢাকার বাইরে"}):</span>
                  <span className="font-semibold tabular-nums text-gray-900">
                    ৳ {deliveryCharge.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#252525] pt-3 border-t border-gray-200">
                  <span>সর্বমোট প্রদেয় মূল্য:</span>
                  <span className="text-xl text-[#762A43] tabular-nums">
                    ৳ {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl bg-[#762A43] hover:bg-[#5E2034] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>অর্ডার প্রসেস হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি)</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-gray-400 space-y-1">
                <p>🔒 আপনার তথ্য সুরক্ষিত এবং নিরাপদ।</p>
                <p>যেকোনো প্রয়োজনে কল করুন: {sitePhone}</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
