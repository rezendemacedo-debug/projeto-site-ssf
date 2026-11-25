"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CITIES } from "@/domain/cities";

export function CitySelect({ value }: { value: string }) {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  return (
    <label className="inline">
      Cidade
      <select
        value={value}
        onChange={(e) => {
          const next = new URLSearchParams(params);
          next.set("cidade", e.target.value);
          router.replace(`${path}?${next}`, { scroll: false });
        }}
      >
        {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
      </select>
    </label>
  );
}
