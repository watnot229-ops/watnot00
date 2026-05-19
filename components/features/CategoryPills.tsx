"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface CategoryPillsProps {
  categories: { id: string; name: string; icon_url?: string | null }[];
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect("all")}
        className={cn(
          "flex items-center gap-1.5 px-4 h-10 rounded-full text-sm font-semibold whitespace-nowrap transition-all border",
          selected === "all"
            ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
            : "bg-zinc-950 text-text-secondary border-zinc-800 hover:border-primary hover:text-primary"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "flex items-center gap-1.5 px-4 h-10 rounded-full text-sm font-semibold whitespace-nowrap transition-all border",
            selected === cat.id
              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
              : "bg-zinc-950 text-text-secondary border-zinc-800 hover:border-primary hover:text-primary"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
