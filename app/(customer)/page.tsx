"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/features/ProductCard";
import { CategoryPills } from "@/components/features/CategoryPills";
import { ArrowRight, Clock, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

const SUPER_CATEGORIES = [
  { id: "food", name: "Food", slugs: ["snacks", "instant-food", "bakery", "breakfast", "frozen-foods", "beverages"] },
  { id: "grocery", name: "Grocery", slugs: ["fruits-veggies", "staples-grains", "cleaning", "personal-care", "pet-care", "baby-care", "condiments"] },
  { id: "dairy", name: "Dairy Products", slugs: ["dairy-eggs"] },
  { id: "meat", name: "Meat", slugs: ["meat-seafood"] }
];

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: featuredItems }] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("products").select("*").eq("is_featured", true).limit(8),
      ]);
      setCategories(cats || []);
      setFeatured(featuredItems || []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      let query = supabase.from("products").select("*").eq("is_available", true);
      
      if (selectedCategory !== "all") {
        const activeSuper = SUPER_CATEGORIES.find(sc => sc.id === selectedCategory);
        if (activeSuper) {
          const matchedCats = categories.filter(c => activeSuper.slugs.includes(c.slug));
          const catIds = matchedCats.map(c => c.id);
          if (catIds.length > 0) {
            query = query.in("category_id", catIds);
          } else {
            setProducts([]);
            return;
          }
        }
      }
      
      const { data } = await query.order("created_at", { ascending: false }).limit(40);
      setProducts(data || []);
    }
    if (categories.length > 0 || selectedCategory === "all") {
      loadProducts();
    }
  }, [selectedCategory, categories]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] p-8 md:p-12 text-white">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Hyperlocal delivery
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            Delivered in<br />
            <span className="text-white">10 Minutes.</span>
          </h1>
          <p className="mt-3 text-white/80 text-lg">
            Fresh groceries, daily essentials & meals delivered straight to Indiabulls Greens, Panvel.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        {/* decorative */}
        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-white/10 rounded-full" />
        <div className="absolute -right-4 top-4 w-32 h-32 bg-white/10 rounded-full" />
      </section>

      {/* Trust badges */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { icon: Clock, label: "10 Min Delivery" },
          { icon: ShieldCheck, label: "100% Fresh" },
          { icon: Zap, label: "Best Prices" },
        ].map((b) => (
          <div key={b.label} className="flex flex-col items-center gap-2 p-4 bg-zinc-950 border border-zinc-900 rounded-xl text-center">
            <b.icon className="w-6 h-6 text-primary" />
            <span className="text-xs font-semibold text-text-secondary">{b.label}</span>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section>
        <h2 className="font-heading text-xl font-bold text-text-primary mb-3">Shop by Category</h2>
        <CategoryPills categories={SUPER_CATEGORIES} selected={selectedCategory} onSelect={setSelectedCategory} />
      </section>

      {/* Featured / Deals */}
      {featured.length > 0 && selectedCategory === "all" && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-bold text-text-primary">🔥 Deals of the Day</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {featured.map((p) => (
              <div key={p.id} className="w-40 shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products grid */}
      <section>
        <h2 className="font-heading text-xl font-bold text-text-primary mb-4">
          {selectedCategory === "all"
            ? "All Products"
            : SUPER_CATEGORIES.find((c) => c.id === selectedCategory)?.name || "Products"}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-4xl mb-3">🛒</p>
            <p className="font-semibold">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
