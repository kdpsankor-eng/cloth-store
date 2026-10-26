import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const [product, categories, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isActive: true } },
        category: true,
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.siteSetting.findMany(),
  ]);

  if (!product) {
    notFound();
  }

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  // Related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      category: true,
    },
    take: 4,
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        categories={categories}
        announcement={settingsMap["announcement_bn"]}
        phone={settingsMap["site_phone"]}
        siteName={settingsMap["site_name"]}
      />

      <main className="flex-1 bg-white py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#762A43]">
              হোম
            </Link>
            <span>/</span>
            <Link href={`/category/${product.category.slug}`} className="hover:text-[#762A43]">
              {product.category.nameBn || product.category.name}
            </Link>
            <span>/</span>
            <span className="text-[#252525] font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.nameBn || product.name}
            </span>
          </nav>

          {/* Interactive PDP Client */}
          <ProductDetailsClient
            product={product}
            supportPhone={settingsMap["site_phone"]}
            supportWhatsapp={settingsMap["site_whatsapp"]}
          />

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-100">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-[#C5A46D] uppercase tracking-wider block mb-1">
                  আরও পছন্দ হতে পারে
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#252525]">
                  সম্পর্কিত অন্যান্য পোশাক
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
                {relatedProducts.map((p) => (
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
