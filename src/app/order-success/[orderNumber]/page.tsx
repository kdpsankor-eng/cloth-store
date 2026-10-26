import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Truck, ArrowRight, MessageCircle, MapPin, Phone, User, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderSuccessPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = await params;

  const [order, categories, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.siteSetting.findMany(),
  ]);

  if (!order) {
    notFound();
  }

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const whatsappNumber = settingsMap["site_whatsapp"] || "01712-345678";
  const whatsappMsg = encodeURIComponent(
    `হ্যালো! আমি একটি অর্ডার করেছি।\n\nঅর্ডার নাম্বার: ${order.orderNumber}\nনাম: ${order.customerName}\nমোবাইল: ${order.customerPhone}\nমোট মূল্য: ৳ ${order.totalPayable}\n\nঅনুগ্রহ করে অর্ডারটি দ্রুত পাঠিয়ে দিন।`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header
        categories={categories}
        announcement={settingsMap["announcement_bn"]}
        phone={settingsMap["site_phone"]}
        siteName={settingsMap["site_name"]}
      />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Success Banner */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-lg text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">
                অর্ডার সফলভাবে সম্পন্ন হয়েছে
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#252525] mt-3">
                ধন্যবাদ! আপনার অর্ডারটি গৃহীত হয়েছে
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
                আমাদের প্রতিনিধি শীঘ্রই আপনার নাম্বারে কল করে অর্ডারটি নিশ্চিত করবেন এবং দ্রুত ডেলিভারি সম্পন্ন করবেন।
              </p>
            </div>

            {/* Order Number Box */}
            <div className="p-4 rounded-2xl bg-[#F7F0E8] border border-[#C5A46D]/40 inline-block text-left sm:text-center w-full sm:w-auto">
              <span className="text-xs text-gray-600 block">আপনার অর্ডার নাম্বার:</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#762A43] tracking-wide select-all">
                {order.orderNumber}
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5">
                * অর্ডার ট্র্যাক করার জন্য এই নাম্বারটি সংরক্ষণ করে রাখুন।
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/track-order?orderNumber=${order.orderNumber}&phone=${order.customerPhone}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#762A43] hover:bg-[#5E2034] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>লাইভ অর্ডার ট্র্যাক করুন</span>
              </Link>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>হোয়াটসঅ্যাপে মেসেজ পাঠান</span>
              </a>
            </div>

            {/* Order Details Grid */}
            <div className="pt-8 border-t border-gray-100 text-left space-y-6">
              <h3 className="text-sm font-bold text-[#252525] uppercase tracking-wider">
                অর্ডার ও ডেলিভারি বিবরণ
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-[#762A43]" />
                    <span className="font-semibold">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-[#762A43]" />
                    <span className="tabular-nums">{order.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-[#762A43] shrink-0 mt-0.5" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-gray-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">পেমেন্ট মেথড:</span>
                    <span className="font-semibold text-gray-800">ক্যাশ অন ডেলিভারি (বকেয়া)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ডেলিভারি এলাকা:</span>
                    <span className="font-semibold text-gray-800">
                      {order.deliveryZone === "INSIDE_DHAKA" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">অর্ডার তারিখ:</span>
                    <span className="font-semibold text-gray-800 tabular-nums">
                      {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F7F0E8]/60 text-gray-700 border-b border-gray-100">
                    <tr>
                      <th className="p-3">পোশাক</th>
                      <th className="p-3">সাইজ</th>
                      <th className="p-3 text-center">পরিমাণ</th>
                      <th className="p-3 text-right">মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((it) => (
                      <tr key={it.id}>
                        <td className="p-3 font-medium text-gray-900">
                          {it.productNameSnapshot}
                        </td>
                        <td className="p-3 text-gray-600">
                          {it.variantNameSnapshot || "Free Size"}
                        </td>
                        <td className="p-3 text-center tabular-nums text-gray-800 font-semibold">
                          {it.quantity}
                        </td>
                        <td className="p-3 text-right tabular-nums font-bold text-[#762A43]">
                          ৳ {it.lineTotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-medium">
                    <tr>
                      <td colSpan={3} className="p-3 text-right text-gray-600">
                        সাবটোটাল:
                      </td>
                      <td className="p-3 text-right font-semibold tabular-nums">
                        ৳ {order.subtotal.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="p-3 text-right text-gray-600">
                        ডেলিভারি চার্জ:
                      </td>
                      <td className="p-3 text-right font-semibold tabular-nums">
                        ৳ {order.deliveryCharge.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200 text-sm font-bold text-[#252525]">
                      <td colSpan={3} className="p-3 text-right">
                        সর্বমোট প্রদেয় বিল:
                      </td>
                      <td className="p-3 text-right text-base text-[#762A43] tabular-nums">
                        ৳ {order.totalPayable.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="pt-4 text-center">
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-[#762A43] underline underline-offset-4"
              >
                হোমপেজে ফিরে যান
              </Link>
            </div>
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
