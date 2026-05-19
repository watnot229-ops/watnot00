"use client";

import Link from "next/link";
import { ShoppingCart, MapPin, Search, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const { items } = useCart();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-black border-b border-zinc-900 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-heading font-bold text-2xl text-primary">Watnot</span>
        </Link>

        {/* Location — fixed to service area */}
        <div className="flex items-center gap-1.5 text-sm min-w-0">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-text-primary text-xs leading-tight truncate">Indiabulls Greens</p>
            <p className="text-text-secondary text-xs leading-tight truncate">Panvel, Navi Mumbai</p>
          </div>
        </div>

        {/* Search */}
        <Link
          href="/search"
          className="hidden sm:flex flex-1 items-center gap-2 bg-zinc-900 rounded-lg px-4 h-10 text-text-secondary hover:bg-zinc-800 transition-colors max-w-xs border border-zinc-800"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Search for groceries…</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link href="/search" className="sm:hidden p-2 rounded-full hover:bg-surface transition-colors">
            <Search className="w-5 h-5 text-text-secondary" />
          </Link>
          <Link href="/account" className="p-2 rounded-full hover:bg-surface transition-colors">
            <User className="w-5 h-5 text-text-secondary" />
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-2 bg-primary text-white px-4 h-10 rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-text-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
