"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { OrderCard } from "@/components/features/OrderCard";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      let customerId = user?.id;
      if (!customerId) {
        const savedSession = localStorage.getItem("mock-user-session");
        customerId = savedSession ? JSON.parse(savedSession).id : "mock-customer-123";
      }
      const { data } = await (supabase as any).from("orders").select("*").eq("customer_id", customerId).order("created_at", { ascending: false });
      
      const savedHist = localStorage.getItem("mock-orders-history");
      const offlineOrders = savedHist ? JSON.parse(savedHist) : [];
      const dbOrders = data || [];
      
      setOrders([...offlineOrders, ...dbOrders]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">My Orders</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl h-28 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="font-heading font-bold text-text-primary mb-2">No orders yet</h2>
          <p className="text-text-secondary mb-6">Place your first order and get it delivered in 10 minutes!</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}
