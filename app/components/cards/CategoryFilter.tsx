"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  popular: boolean;
}

interface CategoryFilterProps {
  selected: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories);
        setLoading(false);
      })
      .catch(() => {
        setCategories([
          { id: "shopping", name: "Shopping", icon: "🛒", popular: true },
          { id: "gaming", name: "Gaming", icon: "🎮", popular: true },
          { id: "streaming", name: "Streaming", icon: "🎬", popular: true },
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex gap-2 overflow-x-auto pb-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="w-20 h-10 bg-slate-800 rounded-lg animate-pulse" />
      ))}
    </div>;
  }

  const popular = categories.filter(c => c.popular);
  const others = categories.filter(c => !c.popular);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-400">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Categories</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect("")}
          className={`px-3 py-1.5 rounded-full text-sm transition ${
            selected === ""
              ? "bg-primary-600 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          All
        </button>
        
        {popular.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              selected === cat.id
                ? "bg-primary-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
        
        {others.length > 0 && (
          <details className="relative group">
            <summary className="px-3 py-1.5 rounded-full bg-slate-700 text-slate-300 text-sm cursor-pointer hover:bg-slate-600">
              More...
            </summary>
            <div className="absolute left-0 top-full mt-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-2 z-10 min-w-[200px]">
              {others.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onSelect(cat.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 text-left"
                >
                  <span>{cat.icon}</span>
                  <span className="text-slate-300">{cat.name}</span>
                </button>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}