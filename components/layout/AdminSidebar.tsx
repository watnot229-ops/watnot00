"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Ticket,
  BarChart2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Delivery Agents", href: "/admin/delivery-agents", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 min-h-screen flex flex-col py-6 px-4 shrink-0">
      <Link href="/" className="px-2 mb-8">
        <span className="font-heading font-bold text-2xl text-primary">Watnot</span>
        <span className="block text-xs text-gray-400 mt-0.5">Admin Dashboard</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 px-2">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Back to store
        </Link>
      </div>
    </aside>
  );
}
