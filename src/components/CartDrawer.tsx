"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition ease-in-out duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F7F0E8]/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#762A43]" />
              <h2 className="text-lg font-semibold text-[#252525]">
                শপিং ব্যাগ ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#F7F0E8] flex items-center justify-center text-[#762A43]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <p className="text-base font-medium">আপনার শপিং ব্যাগটি খালি</p>
                <button
                  onClick={closeCart}
                  className="mt-2 text-sm text-[#762A43] font-semibold underline underline-offset-4 hover:text-[#5E2034]"
                >
                  নতুন কালেকশন ব্রাউজ করুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="flex gap-3.5 p-3 rounded-lg border border-gray-100 bg-white hover:border-[#C5A46D]/40 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded-md overflow-hidden bg-gray-50 shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.nameBn || item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="text-sm font-medium text-[#252525] line-clamp-1">
                          {item.nameBn || item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant Specs */}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.size && (
                          <span className="text-xs px-2 py-0.5 rounded bg-[#F7F0E8] text-[#762A43] font-medium">
                            সাইজ: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            {item.color}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and Quantity Adjuster */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold tabular-nums text-[#252525]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-[#762A43] tabular-nums">
                        ৳ {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-[#F8F9FA] space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">সাবটোটাল:</span>
                <span className="text-lg font-bold text-[#252525] tabular-nums">
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                * ডেলিভারি চার্জ চেকআউট পেইজে সিলেক্ট করুন (ক্যাশ অন ডেলিভারি)
              </p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 px-4 bg-[#762A43] hover:bg-[#5E2034] text-white rounded-lg font-semibold text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>অর্ডার নিশ্চিত করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
