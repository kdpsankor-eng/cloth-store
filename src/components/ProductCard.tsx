"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface ProductCardProps {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  regularPrice: number;
  salePrice?: number | null;
  images: Array<{ imageUrl: string; altText?: string | null }>;
  category?: { name: string; nameBn: string; slug: string };
  hasSizeVariants?: boolean;
}

export default function ProductCard({
  id,
  name,
  nameBn,
  slug,
  regularPrice,
  salePrice,
  images,
  category,
  hasSizeVariants = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const displayPrice = salePrice && salePrice > 0 ? salePrice : regularPrice;
  const hasDiscount = salePrice && salePrice > 0 && salePrice < regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - salePrice!) / regularPrice) * 100)
    : 0;

  const thumbnail =
    images[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If product requires choosing size, redirect to PDP directly
    if (hasSizeVariants) {
      window.location.href = `/products/${slug}`;
      return;
    }

    addToCart({
      productId: id,
      name,
      nameBn,
      slug,
      imageUrl: thumbnail,
      price: displayPrice,
      quantity: 1,
      maxStock: 50,
      size: "Free Size",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-[#C5A46D]/60 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Link */}
      <Link href={`/products/${slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 block">
        <Image
          src={thumbnail}
          alt={nameBn || name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-[#762A43] text-[#F7F0E8] text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {discountPercent}% ছাড়
          </div>
        )}

        {/* Category Pill */}
        {category && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-[#252525] text-[10px] font-medium px-2 py-0.5 rounded-md shadow-xs opacity-90 group-hover:opacity-100">
            {category.nameBn || category.name}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${slug}`} className="block group-hover:text-[#762A43] transition-colors">
            <h3 className="text-sm font-semibold text-[#252525] line-clamp-2 leading-snug">
              {nameBn || name}
            </h3>
          </Link>

          {/* Pricing Row */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#762A43] tabular-nums">
              ৳ {displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through tabular-nums">
                ৳ {regularPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
          <Link
            href={`/products/${slug}`}
            className="w-full py-2 px-2 rounded-lg bg-[#762A43] hover:bg-[#5E2034] text-white text-xs font-semibold text-center flex items-center justify-center gap-1 transition-colors shadow-xs"
          >
            <span>অর্ডার করুন</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={handleQuickAdd}
            className={`w-full py-2 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
              added
                ? "bg-green-50 border-green-500 text-green-700"
                : "border-gray-200 text-gray-700 hover:border-[#762A43] hover:text-[#762A43] hover:bg-[#F7F0E8]/30"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3 text-green-600" />
                <span>যুক্ত হয়েছে</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>{hasSizeVariants ? "সাইজ দেখুন" : "কার্টে রাখুন"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
