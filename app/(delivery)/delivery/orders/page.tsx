"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const statusConfig: Record<string, { variant: any }> = {
  placed: { variant: "outline" },
  confirmed: { variant: "default" },
  picked_up: { variant: "warning" },
  on_the_way: { variant: "warning" },
  delivered: { variant: "success" },
  cancelled: { variant: "danger" },
};

export default function DeliveryOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      let userId = user?.id || "mock-agent-123";
      const { data } = await supabase.from("orders").select("*").eq("delivery_agent_id", userId).order("created_at", { ascending: false });
      
      const savedHist = localStorage.getItem("mock-orders-history");
      const offlineOrders = savedHist ? JSON.parse(savedHist) : [];
      const assignedLocalOrders = offlineOrders.filter((o: any) => o.delivery_agent_id === userId);
      const dbOrders = data || [];

      setOrders([...assignedLocalOrders, ...dbOrders]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="font-heading text-xl font-bold text-text-primary mb-4">Delivery History</h1>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">No orders assigned yet</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const s = statusConfig[o.status] || { variant: "outline" };
            return (
              <div key={o.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-primary text-sm">{o.order_number}</p>
                  <Badge variant={s.variant}>{o.status.replace("_", " ")}</Badge>
                </div>
                <p className="text-xs text-text-secondary">{format(new Date(o.created_at), "d MMM yyyy, h:mm a")}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-text-secondary">{Array.isArray(o.items) ? o.items.length : 0} items</span>
                  <span className="text-sm font-bold">{formatCurrency(o.total || 0)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
