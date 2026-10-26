"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Search, Plus, CheckCircle2, AlertTriangle, Layers, Edit } from "lucide-react";

interface Variant {
  id: string;
  sku: string;
  size?: string | null;
  color?: string | null;
  stockQuantity: number;
}

interface ProductRecord {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  sku: string;
  regularPrice: number;
  salePrice?: number | null;
  hasSizeVariants: boolean;
  category: { name: string; nameBn: string };
  images: Array<{ imageUrl: string }>;
  variants: Variant[];
}

export default function AdminProductsClient({
  initialProducts,
}: {
  initialProducts: ProductRecord[];
}) {
  const [products, setProducts] = useState<ProductRecord[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [toast, setToast] = useState("");

  const handleUpdateStock = async (variantId: string) => {
    try {
      const res = await fetch("/api/admin/products/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stockQuantity: newStock }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => ({
            ...p,
            variants: p.variants.map((v) =>
              v.id === variantId ? { ...v, stockQuantity: newStock } : v
            ),
          }))
        );

        setToast("স্টক সফলভাবে আপডেট হয়েছে!");
        setEditingVariantId(null);
        setTimeout(() => setToast(""), 3000);
      } else {
        alert("স্টক আপডেট ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      alert("সার্ভার সমস্যা। আবার চেষ্টা করুন।");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameBn.includes(search) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#252525]">
            প্রোডাক্ট ও ইনভেন্টরি ম্যানেজমেন্ট
          </h1>
          <p className="text-xs text-gray-500">
            পোশাকের তালিকা, দাম ও সাইজ অনুযায়ী স্টক নিয়ন্ত্রণ
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="পোশাকের নাম বা কোড খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs text-[#252525] focus:outline-hidden focus:border-[#762A43]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100 font-semibold">
              <tr>
                <th className="p-4">ছবি ও নাম</th>
                <th className="p-4">ক্যাটাগরি</th>
                <th className="p-4">কোড (SKU)</th>
                <th className="p-4">রেগুলার মূল্য</th>
                <th className="p-4">অফার মূল্য</th>
                <th className="p-4">সাইজ ও স্টক</th>
                <th className="p-4 text-right">ওয়েবসাইট লিংক</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
                const thumbnail =
                  p.images[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80";

                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                        <Image
                          src={thumbnail}
                          alt={p.nameBn || p.name}
                          fill
                          className="object-cover"
                          sizes="50px"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block leading-tight">
                          {p.nameBn || p.name}
                        </span>
                        <span className="text-[11px] text-gray-400 truncate max-w-xs block">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {p.category.nameBn || p.category.name}
                    </td>
                    <td className="p-4 font-mono text-gray-500 font-semibold">{p.sku}</td>
                    <td className="p-4 tabular-nums text-gray-600 font-medium">
                      ৳ {p.regularPrice.toLocaleString()}
                    </td>
                    <td className="p-4 tabular-nums font-bold text-[#762A43]">
                      {p.salePrice ? `৳ ${p.salePrice.toLocaleString()}` : "-"}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-gray-800">
                          <span className="tabular-nums">মোট স্টক: {totalStock}টি</span>
                          {totalStock <= 5 && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                              কম স্টক
                            </span>
                          )}
                        </div>

                        {/* Variants breakdown */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.variants.map((v) => (
                            <div
                              key={v.id}
                              className="inline-flex items-center gap-1 bg-[#F8F9FA] border border-gray-200 px-2 py-0.5 rounded text-[11px]"
                            >
                              <span className="font-semibold text-gray-700">{v.size}:</span>
                              {editingVariantId === v.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={newStock}
                                    onChange={(e) => setNewStock(parseInt(e.target.value, 10) || 0)}
                                    className="w-12 px-1 border border-[#762A43] rounded text-center font-bold"
                                  />
                                  <button
                                    onClick={() => handleUpdateStock(v.id)}
                                    className="bg-[#762A43] text-white px-1.5 rounded text-[10px]"
                                  >
                                    সেভ
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingVariantId(v.id);
                                    setNewStock(v.stockQuantity);
                                  }}
                                  className="tabular-nums font-bold text-[#762A43] hover:underline cursor-pointer"
                                  title="স্টক এডিট করতে ক্লিক করুন"
                                >
                                  {v.stockQuantity}টি ✎
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg bg-[#F7F0E8] text-[#762A43] hover:bg-[#ebdccf] font-semibold text-xs transition-colors"
                      >
                        পণ্য দেখুন ↗
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
