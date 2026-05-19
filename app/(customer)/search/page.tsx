"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/features/ProductCard";
import { Input } from "@/components/ui/Input";
import { Search, SlidersHorizontal } from "lucide-react";

function useDebounce(value: string, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 350);

  const supabase = createClient();

  useEffect(() => {
    async function search() {
      setLoading(true);
      let q = supabase
        .from("products")
        .select("*, categories(name)")
        .eq("is_available", true);

      if (debouncedQuery) {
        q = q.ilike("name", `%${debouncedQuery}%`);
      }

      const { data } = await q.limit(50);
      setResults(data || []);
      setLoading(false);
    }
    search();
  }, [debouncedQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-4">Search</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for groceries, snacks, dairy…"
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-shadow"
          autoFocus
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-semibold text-text-primary">
            {query ? `No results for "${query}"` : "Start typing to search"}
          </p>
          <p className="text-sm mt-1">{query ? "Try a different keyword" : "Find your favourite products"}</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-secondary mb-4">{results.length} results</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
