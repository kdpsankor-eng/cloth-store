"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Phone,
} from "lucide-react";

interface StatusHistoryItem {
  id: string;
  status: string;
  notes?: string | null;
  createdAt: string;
}

interface OrderItem {
  id: string;
  productNameSnapshot: string;
  variantNameSnapshot?: string | null;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderStatus: string;
  totalPayable: number;
  paymentMethod: string;
  courierName?: string | null;
  trackingCode?: string | null;
  createdAt: string;
  items: OrderItem[];
  statusHistory: StatusHistoryItem[];
}

export default function TrackOrderClient({
  supportPhone = "01712-345678",
}: {
  supportPhone?: string;
}) {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("orderNumber") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderNumber.trim()) {
      setError("অনুগ্রহ করে আপনার অর্ডার নাম্বারটি লিখুন।");
      return;
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, "");
    if (!cleanPhone || cleanPhone.length < 11) {
      setError("অনুগ্রহ করে চেকআউটে ব্যবহৃত ১১ ডিজিটের মোবাইল নাম্বারটি দিন।");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          phone: cleanPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "অর্ডারটি খুঁজে পাওয়া যায়নি। তথ্য সঠিক কিনা চেক করুন।");
        setLoading(false);
        return;
      }

      setOrder(data.order);
    } catch (err) {
      setError("সার্ভারের সাথে যোগাযোগ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrder && initialPhone) {
      handleTrack();
    }
  }, [initialOrder, initialPhone]);

  // Order milestones definition
  const milestones = [
    { key: "PENDING", title: "অর্ডার গৃহীত", desc: "আমরা আপনার অর্ডারটি পেয়েছি" },
    { key: "CONFIRMED", title: "অর্ডার কনফার্মড", desc: "ফোন কলের মাধ্যমে নিশ্চিত করা হয়েছে" },
    { key: "PROCESSING", title: "প্যাকেজিং হচ্ছে", desc: "পণ্য প্রস্তুত ও প্যাকিং চলছে" },
    { key: "SHIPPED", title: "কুরিয়ারে পাঠানো হয়েছে", desc: "ডেলিভারিম্যান এর পথে" },
    { key: "DELIVERED", title: "ডেলিভারি সম্পন্ন", desc: "গ্রাহক পণ্য বুঝে পেয়েছেন" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return -1;
    }
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : -1;
  const isFailedOrCancelled =
    order && ["CANCELLED", "RETURNED", "DELIVERY_FAILED"].includes(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#F7F0E8] text-[#762A43] flex items-center justify-center mx-auto mb-2">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#252525]">
          লাইভ অর্ডার ট্র্যাকিং
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          আপনার অর্ডার নাম্বার এবং মোবাইল নাম্বার দিয়ে পার্সেলের বর্তমান অবস্থান জানুন।
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-xs">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              অর্ডার নাম্বার <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: WCS-261024-8492"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-mono text-[#252525] focus:outline-hidden focus:border-[#762A43] transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              মোবাইল নাম্বার <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm tabular-nums text-[#252525] focus:outline-hidden focus:border-[#762A43] transition-all"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#762A43] hover:bg-[#5E2034] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>খোঁজা হচ্ছে...</span>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>ট্র্যাক করুন</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tracking Result View */}
      {order && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-md space-y-8 animate-in fade-in duration-300">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div>
              <span className="text-xs text-gray-500">অর্ডার ট্র্যাকিং তথ্য:</span>
              <h2 className="text-xl font-bold font-mono text-[#762A43]">
                {order.orderNumber}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                অর্ডার গ্রহীতা: <span className="font-semibold text-gray-800">{order.customerName}</span> ({order.customerPhone})
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-gray-500 block">মোট প্রদেয় বিল:</span>
              <span className="text-xl font-bold text-[#252525] tabular-nums">
                ৳ {order.totalPayable.toLocaleString()}
              </span>
              <span className="block text-[11px] text-green-700 font-medium">
                ক্যাশ অন ডেলিভারি (বকেয়া)
              </span>
            </div>
          </div>

          {/* Timeline Milestones */}
          {!isFailedOrCancelled ? (
            <div className="py-4">
              <h3 className="text-xs font-bold text-[#C5A46D] uppercase tracking-wider mb-6">
                ডেলিভারি অগ্রগতি ও টাইমলাইন
              </h3>

              <div className="relative">
                {/* Horizontal Progress Line on Desktop */}
                <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-gray-200 -z-0">
                  <div
                    className="h-full bg-[#762A43] transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentStep) / (milestones.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                  {milestones.map((m, idx) => {
                    const isDone = currentStep >= idx;
                    const isCurrent = currentStep === idx;

                    return (
                      <div
                        key={m.key}
                        className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-xs ${
                            isDone
                              ? "bg-[#762A43] text-white ring-4 ring-[#F7F0E8]"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <h4
                            className={`text-xs font-bold ${
                              isCurrent ? "text-[#762A43]" : isDone ? "text-[#252525]" : "text-gray-400"
                            }`}
                          >
                            {m.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                            {m.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Cancelled or Returned Alert Box */
            <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-red-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>
                  {order.orderStatus === "CANCELLED"
                    ? "অর্ডারটি বাতিল করা হয়েছে"
                    : order.orderStatus === "RETURNED"
                    ? "পণ্যটি রিটার্ন হিসেবে গৃহীত হয়েছে"
                    : "ডেলিভারি ব্যর্থ হয়েছে"}
                </span>
              </div>
              <p className="text-xs text-red-700">
                এই অর্ডার সংক্রান্ত কোনো তথ্য বা প্রশ্ন থাকলে অনুগ্রহ করে আমাদের সাপোর্ট হেল্পলাইনে যোগাযোগ করুন: {supportPhone}
              </p>
            </div>
          )}

          {/* Courier Details (When available) */}
          {order.courierName && (
            <div className="p-4 rounded-xl bg-[#F7F0E8]/60 border border-[#C5A46D]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#762A43] text-white flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-gray-500 block">কুরিয়ার পার্টনার:</span>
                  <span className="font-bold text-gray-900 text-sm">{order.courierName}</span>
                </div>
              </div>

              {order.trackingCode && (
                <div>
                  <span className="text-gray-500 block">কনসাইনমেন্ট / ট্র্যাকিং কোড:</span>
                  <span className="font-mono font-bold text-[#762A43]">{order.trackingCode}</span>
                </div>
              )}
            </div>
          )}

          {/* Ordered Items Preview */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              অর্ডারের আইটেমসমূহ
            </h4>
            <div className="divide-y divide-gray-100 text-xs">
              {order.items.map((it) => (
                <div key={it.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-gray-900">{it.productNameSnapshot}</span>
                    <span className="text-gray-500 ml-2">({it.variantNameSnapshot || "Free Size"})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">পরিমাণ: {it.quantity}টি</span>
                    <span className="font-bold text-[#762A43] tabular-nums">৳ {it.lineTotal.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
