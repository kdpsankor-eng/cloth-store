import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60; // ISR cache for blazing speed

async function getHomePageData() {
  const [categories, products, settings] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.siteSetting.findMany(),
  ]);

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return { categories, products, settingsMap };
}

export default async function HomePage() {
  const { categories, products, settingsMap } = await getHomePageData();

  const siteName = settingsMap["site_name"] || "অরণ্যা ফ্যাশন";
  const heroTitle = settingsMap["hero_title"] || "ঐতিহ্য ও আধুনিকতার অনন্য নারী ফ্যাশন";
  const heroSubtitle =
    settingsMap["hero_subtitle"] || "সেরা মানের কটন, সিল্ক ও জর্জেট কালেকশন এখন বিশেষ অফারে।";
  const heroImage =
    settingsMap["hero_banner_image"] ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80";
  const announcement = settingsMap["announcement_bn"];
  const phone = settingsMap["site_phone"];

  const featuredProducts = products.filter((p) => p.isFeatured);
  const newArrivals = products.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Header with dynamic DB data */}
      <Header
        categories={categories}
        announcement={announcement}
        phone={phone}
        siteName={siteName}
      />

      <main className="flex-1">
        {/* 2. Hero Fashion Banner */}
        <section className="relative bg-[#F7F0E8] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Text content */}
              <div className="space-y-6 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C5A46D]/40 text-[#762A43] text-xs font-semibold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>নতুন ঈদ ও উৎসব কালেকশন ২০২৬</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#252525] tracking-tight leading-tight font-serif">
                  {heroTitle}
                </h1>

                <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {heroSubtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    href="/products"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#762A43] hover:bg-[#5E2034] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <span>কালেকশন দেখুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/category/salwar-kameez"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-[#252525] font-semibold text-sm text-center transition-all"
                  >
                    থ্রি-পিস কালেকশন
                  </Link>
                </div>

                {/* Quick Trust points */}
                <div className="grid grid-cols-3 gap-2 pt-6 border-t border-[#C5A46D]/30 max-w-md mx-auto lg:mx-0 text-center">
                  <div>
                    <span className="block text-base font-bold text-[#762A43] tabular-nums">১০০%</span>
                    <span className="text-[11px] text-gray-600">আসল ফেব্রিক্স</span>
                  </div>
                  <div>
                    <span className="block text-base font-bold text-[#762A43]">ক্যাশ অন</span>
                    <span className="text-[11px] text-gray-600">ডেলিভারি</span>
                  </div>
                  <div>
                    <span className="block text-base font-bold text-[#762A43] tabular-nums">২৪-৪৮h</span>
                    <span className="text-[11px] text-gray-600">দ্রুত ডেলিভারি</span>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={heroImage}
                  alt={heroTitle}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Category Showcase Grid */}
        <section className="py-14 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-[#C5A46D] uppercase tracking-wider block mb-1">
                  ক্যাটাগরি অনুযায়ী ব্রাউজ করুন
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#252525] font-serif">
                  জনপ্রিয় ফ্যাশন ক্যাটাগরি
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#762A43] hover:underline"
              >
                <span>সব দেখুন</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative rounded-xl overflow-hidden aspect-3/4 bg-gray-100 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <Image
                    src={
                      cat.imageUrl ||
                      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={cat.nameBn || cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-sm sm:text-base font-bold font-serif leading-tight">
                      {cat.nameBn || cat.name}
                    </h3>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      {cat._count.products}টি কালেকশন
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. New Arrivals / Featured Products Grid */}
        <section className="py-14 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#762A43] uppercase tracking-wider block mb-1">
                লেটেস্ট কালেকশন
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#252525] font-serif">
                নতুন আকর্ষণীয় পোশাকসমূহ
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                নিখুঁত কারুকাজ ও প্রিমিয়াম ফেব্রিকে তৈরি আমাদের সাম্প্রতিক কালেকশন
              </p>
            </div>

            {/* Responsive 2-col on mobile, 4-col on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {newArrivals.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  name={prod.name}
                  nameBn={prod.nameBn}
                  slug={prod.slug}
                  regularPrice={prod.regularPrice}
                  salePrice={prod.salePrice}
                  images={prod.images}
                  category={prod.category}
                  hasSizeVariants={prod.hasSizeVariants}
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white border border-[#762A43] text-[#762A43] hover:bg-[#762A43] hover:text-white font-semibold text-sm transition-all shadow-xs"
              >
                <span>সকল প্রোডাক্ট ব্রাউজ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Special Offer / Highlight Banner */}
        <section className="py-12 bg-[#762A43] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#C5A46D] text-[#252525] text-xs font-bold">
                  সীমিত সময়ের অফার
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif">
                  যেকোনো ৩টি থ্রি-পিস অর্ডারে ফ্রি ডেলিভারি!
                </h3>
                <p className="text-xs sm:text-sm text-gray-200">
                  সারা বাংলাদেশে ঘরে বসেই কোনো অগ্রিম পেমেন্ট ছাড়াই অর্ডার করুন ক্যাশ অন ডেলিভারিতে।
                </p>
              </div>

              <Link
                href="/category/salwar-kameez"
                className="shrink-0 px-8 py-3.5 rounded-lg bg-[#C5A46D] hover:bg-[#b8955d] text-[#252525] font-bold text-sm shadow-md transition-all"
              >
                অফার নিন
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <Footer
        siteName={siteName}
        tagline={settingsMap["site_tagline"]}
        phone={phone}
        whatsapp={settingsMap["site_whatsapp"]}
        address={settingsMap["site_address"]}
      />
    </div>
  );
}
