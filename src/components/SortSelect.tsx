"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ defaultValue = "newest" }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("sort", val);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <select
      defaultValue={defaultValue}
      onChange={handleSortChange}
      className="bg-transparent font-medium text-[#252525] focus:outline-hidden cursor-pointer"
    >
      <option value="newest">সর্বশেষ কালেকশন</option>
      <option value="price-asc">দাম: কম থেকে বেশি</option>
      <option value="price-desc">দাম: বেশি থেকে কম</option>
    </select>
  );
}
