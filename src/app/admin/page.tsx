import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orders, products, variants] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.product.findMany({
      include: { variants: true },
    }),
    prisma.productVariant.findMany(),
  ]);

  const totalSales = orders
    .filter((o) => o.orderStatus !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalPayable, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === "PENDING");
  const confirmedOrders = orders.filter((o) => o.orderStatus === "CONFIRMED");
  const deliveredOrders = orders.filter((o) => o.orderStatus === "DELIVERED");

  const lowStockVariants = variants.filter((v) => v.stockQuantity <= 5);

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#252525]">
          ড্যাশবোর্ড ওভারভিউ
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          আজকের স্টোর পারফরম্যান্স ও অর্ডারের সার্বিক চিত্র
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">মোট বিক্রয় (বিক্রিত মূল্য)</span>
            <div className="w-8 h-8 rounded-full bg-[#F7F0E8] text-[#762A43] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#762A43] tabular-nums">
            ৳ {totalSales.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-400">সর্বমোট {orders.length}টি অর্ডারের হিসাব</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">পেন্ডিং অর্ডার (কল দরকার)</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 tabular-nums">
            {pendingOrders.length}
          </div>
          <p className="text-[11px] text-gray-400">কনফার্মেশনের অপেক্ষায় রয়েছে</p>
        </div>

        {/* Confirmed / In Transit */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">ডেলিভারি সম্পন্ন</span>
            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-green-600 tabular-nums">
            {deliveredOrders.length}
          </div>
          <p className="text-[11px] text-gray-400">গ্রাহক সফলভাবে বুঝে পেয়েছেন</p>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">লো-স্টক পোশাক</span>
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-600 tabular-nums">
            {lowStockVariants.length}
          </div>
          <p className="text-[11px] text-gray-400">মজুদ ৫টি বা তার কম রয়েছে</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#252525]">সাম্প্রতিক অর্ডার তালিকা</h2>
            <p className="text-xs text-gray-400">সর্বশেষ গ্রাহকদের বুক করা অর্ডারসমূহ</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-[#762A43] hover:underline flex items-center gap-1"
          >
            <span>সবগুলো অর্ডার দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100 font-semibold">
              <tr>
                <th className="p-4">অর্ডার নং</th>
                <th className="p-4">গ্রাহকের নাম ও ফোন</th>
                <th className="p-4">এলাকা</th>
                <th className="p-4">পোশাক সংখ্যা</th>
                <th className="p-4">মূল্য (টাকা)</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    এখনও কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => {
                  let badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                  if (ord.orderStatus === "CONFIRMED")
                    badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                  if (ord.orderStatus === "SHIPPED")
                    badgeColor = "bg-purple-50 text-purple-700 border-purple-200";
                  if (ord.orderStatus === "DELIVERED")
                    badgeColor = "bg-green-50 text-green-700 border-green-200";
                  if (ord.orderStatus === "CANCELLED")
                    badgeColor = "bg-red-50 text-red-700 border-red-200";

                  return (
                    <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#762A43]">
                        {ord.orderNumber}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-900 block">
                          {ord.customerName}
                        </span>
                        <span className="text-[11px] text-gray-500 tabular-nums">
                          {ord.customerPhone}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {ord.deliveryZone === "INSIDE_DHAKA" ? "ঢাকা" : "ঢাকার বাইরে"}
                      </td>
                      <td className="p-4 tabular-nums font-medium text-gray-800">
                        {ord.items.length}টি পোশাক
                      </td>
                      <td className="p-4 tabular-nums font-bold text-[#252525]">
                        ৳ {ord.totalPayable.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeColor}`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/orders`}
                          className="px-3 py-1.5 rounded-lg bg-[#F7F0E8] text-[#762A43] hover:bg-[#ebdccf] font-semibold text-xs transition-colors"
                        >
                          ম্যানেজ
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
