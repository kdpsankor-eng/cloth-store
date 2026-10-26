import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    filter?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const categorySlug = params.category || "";
  const sort = params.sort || "newest";
  const specialFilter = params.filter || "";

  // 1. Fetch Categories and Site Settings for Header & Filters
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.siteSetting.findMany(),
  ]);

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  // 2. Build Prisma Query
  const whereClause: any = { isActive: true };

  if (query) {
    whereClause.OR = [
      { name: { contains: query } },
      { nameBn: { contains: query } },
      { description: { contains: query } },
    ];
  }

  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  if (specialFilter === "offers") {
    whereClause.salePrice = { not: null };
  }

  // 3. Sorting
  let orderByClause: any = { createdAt: "desc" };
  if (sort === "price-asc") orderByClause = { regularPrice: "asc" };
  if (sort === "price-desc") orderByClause = { regularPrice: "desc" };

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      category: true,
      variants: true,
    },
    orderBy: orderByClause,
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        categories={categories}
        announcement={settingsMap["announcement_bn"]}
        phone={settingsMap["site_phone"]}
        siteName={settingsMap["site_name"]}
      />

      <main className="flex-1 bg-[#F8F9FA] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Title */}
          <div className="mb-6">
            <nav className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#762A43]">
                হোম
              </Link>
              <span>/</span>
              <span className="text-[#252525] font-medium">সকল পোশাক</span>
              {query && (
                <>
                  <span>/</span>
                  <span className="text-[#762A43] font-semibold">অনুসন্ধান: "{query}"</span>
                </>
              )}
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#252525] font-serif">
                  {specialFilter === "offers"
                    ? "স্পেশাল অফার ও ডিসকাউন্ট কালেকশন"
                    : query
                    ? `"${query}" এর জন্য সার্চ রেজাল্ট`
                    : "আমাদের সম্পূর্ণ কালেকশন"}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  মোট <span className="font-semibold tabular-nums">{products.length}</span>টি পোশাক পাওয়া গেছে
                </p>
              </div>

              {/* Sorting Controls */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs shadow-xs self-start sm:self-auto">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-500 font-medium">সর্ট:</span>
                <SortSelect defaultValue={sort} />
              </div>
            </div>
          </div>

          {/* Main Layout: Filter Pills & Product Grid */}
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <Link
                href="/products"
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
                  !categorySlug
                    ? "bg-[#762A43] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                সকল ({categories.reduce((acc, c) => acc + c._count.products, 0)})
              </Link>

              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
                    categorySlug === c.slug
                      ? "bg-[#762A43] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {c.nameBn || c.name} ({c._count.products})
                </Link>
              ))}
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-xs">
                <p className="text-gray-500 text-sm font-medium">
                  দুঃখিত, কোনো পোশাক পাওয়া যায়নি। অন্য কোনো নাম বা ক্যাটাগরি দিয়ে চেষ্টা করুন।
                </p>
                <Link
                  href="/products"
                  className="mt-4 inline-block px-5 py-2.5 rounded-lg bg-[#762A43] text-white text-xs font-semibold hover:bg-[#5E2034] transition-colors"
                >
                  সকল কালেকশন দেখুন
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    nameBn={p.nameBn}
                    slug={p.slug}
                    regularPrice={p.regularPrice}
                    salePrice={p.salePrice}
                    images={p.images}
                    category={p.category}
                    hasSizeVariants={p.hasSizeVariants}
                  />
                ))}
              </div>
            )}
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
