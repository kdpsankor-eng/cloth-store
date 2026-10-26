"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  AlertCircle,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Variant {
  id: string;
  sku: string;
  size?: string | null;
  color?: string | null;
  stockQuantity: number;
  priceAdjustment: number;
}

interface ProductDetailsClientProps {
  product: {
    id: string;
    name: string;
    nameBn: string;
    slug: string;
    sku: string;
    description: string;
    descriptionBn?: string | null;
    regularPrice: number;
    salePrice?: number | null;
    hasSizeVariants: boolean;
    sizeSelectionRequired: boolean;
    availableSizes?: string | null;
    category: {
      name: string;
      nameBn: string;
      slug: string;
    };
    images: Array<{
      id: string;
      imageUrl: string;
      altText?: string | null;
      isThumbnail: boolean;
    }>;
    variants: Variant[];
  };
  supportPhone?: string;
  supportWhatsapp?: string;
}

export default function ProductDetailsClient({
  product,
  supportPhone = "01712-345678",
  supportWhatsapp = "01712-345678",
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(
    product.images[0]?.imageUrl ||
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
  );

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length === 1 && !product.hasSizeVariants
      ? product.variants[0]
      : null
  );

  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const displayPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;
  const hasDiscount = product.salePrice && product.salePrice > 0 && product.salePrice < product.regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.regularPrice - product.salePrice!) / product.regularPrice) * 100)
    : 0;

  // Compute available stock
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : 50;

  const handleSelectSize = (variant: Variant) => {
    setSelectedVariant(variant);
    setSizeError(false);
  };

  const validateAndPrepareCartItem = () => {
    if (product.sizeSelectionRequired && !selectedVariant) {
      setSizeError(true);
      return null;
    }

    return {
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      nameBn: product.nameBn,
      slug: product.slug,
      imageUrl: selectedImage,
      size: selectedVariant?.size || (product.hasSizeVariants ? "Standard" : "Free Size"),
      color: selectedVariant?.color || null,
      price: displayPrice + (selectedVariant?.priceAdjustment || 0),
      quantity,
      maxStock: currentStock,
    };
  };

  const handleAddToCart = () => {
    const item = validateAndPrepareCartItem();
    if (!item) return;

    addToCart(item);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    const item = validateAndPrepareCartItem();
    if (!item) return;

    addToCart(item);
    router.push("/checkout");
  };

  const whatsappMessage = encodeURIComponent(
    `হ্যালো! আমি এই পণ্যটি অর্ডার করতে চাই:\n\n*${product.nameBn || product.name}*\nকোড: ${product.sku}\nমূল্য: ৳ ${displayPrice}\nলিংক: ${typeof window !== "undefined" ? window.location.href : ""}`
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
      {/* 1. Left Column: Image Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-md">
          <Image
            src={selectedImage}
            alt={product.nameBn || product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />

          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-[#762A43] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {discountPercent}% স্পেশাল ছাড়
            </div>
          )}
        </div>

        {/* Thumbnail Row */}
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.imageUrl)}
                className={`relative w-20 h-24 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  selectedImage === img.imageUrl
                    ? "border-[#762A43] scale-102 shadow-xs"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.altText || product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Right Column: Product Info & Actions */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#C5A46D] uppercase tracking-wider">
            {product.category.nameBn || product.category.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#252525] font-serif mt-1 leading-snug">
            {product.nameBn || product.name}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            প্রোডাক্ট কোড: <span className="font-mono text-gray-600">{product.sku}</span>
          </p>
        </div>

        {/* Price Row */}
        <div className="p-4 rounded-xl bg-[#F7F0E8]/50 border border-[#C5A46D]/30 flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#762A43] tabular-nums">
            ৳ {displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through tabular-nums">
              ৳ {product.regularPrice.toLocaleString()}
            </span>
          )}
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded ml-auto">
            ইন স্টক (মজুদ আছে)
          </span>
        </div>

        {/* Size Selection (Category Variant Engine) */}
        {product.hasSizeVariants && (
          <div className={`space-y-2.5 p-4 rounded-xl border transition-colors ${sizeError ? "border-red-400 bg-red-50/40" : "border-gray-100 bg-[#F8F9FA]"}`}>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#252525] flex items-center gap-1.5">
                <span>সাইজ বেছে নিন:</span>
                {product.sizeSelectionRequired && (
                  <span className="text-xs text-red-500 font-normal">*আবশ্যক</span>
                )}
              </label>

              {selectedVariant && (
                <span className="text-xs font-medium text-[#762A43]">
                  সিলেক্টেড: {selectedVariant.size}
                </span>
              )}
            </div>

            {/* Size Buttons */}
            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const isOutOfStock = v.stockQuantity <= 0;

                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => handleSelectSize(v)}
                    className={`py-2 px-4 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-[#762A43] text-white border-[#762A43] shadow-xs"
                        : isOutOfStock
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                        : "bg-white text-gray-800 border-gray-200 hover:border-[#762A43] hover:text-[#762A43]"
                    }`}
                  >
                    <span>{v.size}</span>
                    {v.color && <span className="block text-[10px] font-normal opacity-80">{v.color}</span>}
                  </button>
                );
              })}
            </div>

            {sizeError && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>অর্ডার নিশ্চিত করতে অনুগ্রহ করে আপনার প্রয়োজনীয় সাইজ সিলেক্ট করুন!</span>
              </p>
            )}
          </div>
        )}

        {/* Free size notice for Sarees or non-variant clothes */}
        {!product.hasSizeVariants && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600">
            📏 <span className="font-semibold text-gray-800">সাইজ বিবরণ:</span>{" "}
            {product.availableSizes || "রেগুলার / ফ্রি সাইজ (যেকোনো মাপের জন্য উপযুক্ত)"}
          </div>
        )}

        {/* Quantity Selector & CTAs */}
        <div className="space-y-3.5 pt-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-gray-700">পরিমাণ:</span>
            <div className="flex items-center border border-gray-200 rounded-lg bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold tabular-nums text-[#252525]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                disabled={quantity >= currentStock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Direct Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 px-6 rounded-xl bg-[#762A43] hover:bg-[#5E2034] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <span>সরাসরি অর্ডার করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Add To Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                addedAnimation
                  ? "bg-green-50 border-green-600 text-green-700"
                  : "border-[#762A43] text-[#762A43] hover:bg-[#F7F0E8]"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span>কার্ট-এ যুক্ত হয়েছে</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>ব্যাগে যোগ করুন</span>
                </>
              )}
            </button>
          </div>

          {/* Direct WhatsApp Callout */}
          <a
            href={`https://wa.me/${supportWhatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl border border-green-200 bg-green-50/60 hover:bg-green-100 text-green-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span>হোয়াটসঅ্যাপে অর্ডার করতে ক্লিক করুন</span>
          </a>
        </div>

        {/* Product Details & Policy Accordions */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <h4 className="text-xs font-bold text-[#762A43] uppercase tracking-wider mb-2">
              বিস্তারিত বিবরণ
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {product.descriptionBn || product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F8F9FA] border border-gray-100 flex items-start gap-2">
              <Truck className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">হোম ডেলিভারি</p>
                <p className="text-[11px] text-gray-500">ঢাকা: ৮০৳ | বাইরে: ১৫০৳</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FA] border border-gray-100 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">ক্যাশ অন ডেলিভারি</p>
                <p className="text-[11px] text-gray-500">দেখে মূল্য পরিশোধের সুবিধা</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
