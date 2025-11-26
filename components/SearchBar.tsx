"use client";

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  initialValue?: string;
  onSearch: (value: string) => void;
}

export const SearchBar = ({
  initialValue = "",
  onSearch,
}: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    onSearch(debouncedValue.trim());
  }, [debouncedValue, onSearch]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ürün ara..."
        className="w-full appearance-none rounded-full border border-slate-200 bg-white px-5 pr-12 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
      <FiSearch className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
    </div>
  );
};

