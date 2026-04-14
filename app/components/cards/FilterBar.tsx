"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  onSearch: (query: string) => void;
  onRegionChange: (region: string) => void;
  onPriceChange: (range: [number, number]) => void;
}

export default function FilterBar({ onSearch, onRegionChange, onPriceChange }: FilterBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cards..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
            />
          </div>
        </div>

        <select
          onChange={(e) => onRegionChange(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
        >
          <option value="ALL">All Regions</option>
          <option value="US">🇺🇸 United States</option>
          <option value="NG">🇳🇬 Nigeria</option>
        </select>

        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            searchOpen ? "bg-primary-600 text-white" : "bg-slate-800 text-slate-300 border border-slate-700"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {searchOpen && (
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h4 className="text-white font-medium mb-3">Price Range</h4>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              placeholder="Min"
            />
            <span className="text-slate-400">to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              placeholder="Max"
            />
            <button
              onClick={() => onPriceChange(priceRange)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}