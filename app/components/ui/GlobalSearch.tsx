"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchResult {
  id: string;
  type: "card" | "transaction" | "order";
  title: string;
  subtitle: string;
}

interface GlobalSearchProps {
  onSelect?: (result: SearchResult) => void;
}

export default function GlobalSearch({ onSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cards, transactions..."
          className="w-64 lg:w-80 pl-10 pr-10 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-slate-400 text-center">Searching...</div>
          ) : results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    onSelect?.(result);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 text-left"
                >
                  <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-slate-400 text-sm">
                    {result.type === "card" && "🎁"}
                    {result.type === "transaction" && "💳"}
                    {result.type === "order" && "📦"}
                  </div>
                  <div>
                    <p className="text-white">{result.title}</p>
                    <p className="text-slate-400 text-sm">{result.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-slate-400 text-center">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}