"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SortSelectProps {
  value: string;
}

export default function SortSelect({ value }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", e.target.value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="clay-input px-3 py-2 text-xs font-mono uppercase cursor-pointer rounded-none"
    >
      <option value="newest">NEWEST ARRIVALS</option>
      <option value="price-low">PRICE: LOW TO HIGH</option>
      <option value="price-high">PRICE: HIGH TO LOW</option>
      <option value="best-selling">MOST WANTED</option>
      <option value="alphabetical">ALPHABETICAL</option>
    </select>
  );
}
