import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { ArrowUpDown } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort = "newest" } = await searchParams;

  const [category, categories, settings] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.siteSetting.findMany(),
  ]);

  if (!category) {
    notFound();
  }

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  let orderByClause: any = { createdAt: "desc" };
  if (sort === "price-asc") orderByClause = { regularPrice: "asc" };
  if (sort === "price-desc") orderByClause = { regularPrice: "desc" };

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      isActive: true,
    },
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
          {/* Breadcrumbs */}
          <nav className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#762A43]">
              হোম
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#762A43]">
              পোশাক
            </Link>
            <span>/</span>
            <span className="text-[#762A43] font-semibold">{category.nameBn || category.name}</span>
          </nav>

          {/* Category Banner Card */}
          <div className="bg-[#762A43] text-[#F7F0E8] rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-[#C5A46D] uppercase tracking-wider block mb-1">
                কালেকশন ক্যাটাগরি
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
                {category.nameBn || category.name}
              </h1>
              {category.description && (
                <p className="text-xs sm:text-sm text-gray-200 mt-2 leading-relaxed">
                  {category.description}
                </p>
              )}
              <div className="mt-3 text-xs text-[#C5A46D] font-medium">
                মোট <span className="tabular-nums font-bold">{category._count.products}</span>টি ডিজাইন উপলব্ধ
              </div>
            </div>
          </div>

          {/* Sorting Row */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-gray-600 font-medium">
              সবগুলো ডিজাইন ব্রাউজ করুন
            </p>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500 font-medium">সর্ট:</span>
              <SortSelect defaultValue={sort} />
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-xs">
              <p className="text-gray-500 text-sm font-medium">
                এই ক্যাটাগরিতে বর্তমানে কোনো প্রোডাক্ট নেই।
              </p>
              <Link
                href="/products"
                className="mt-4 inline-block px-5 py-2.5 rounded-lg bg-[#762A43] text-white text-xs font-semibold hover:bg-[#5E2034] transition-colors"
              >
                অন্যান্য কালেকশন দেখুন
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
                  category={category}
                  hasSizeVariants={p.hasSizeVariants}
                />
              ))}
            </div>
          )}
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
