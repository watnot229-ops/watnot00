"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, TrendingUp, Truck, Users } from "lucide-react";
import { format } from "date-fns";

import { Modal } from "@/components/ui/Modal";
import toast from "react-hot-toast";

const statusConfig: Record<string, { label: string; variant: any }> = {
  placed: { label: "Placed", variant: "outline" },
  confirmed: { label: "Confirmed", variant: "default" },
  packed: { label: "Packed", variant: "warning" },
  picked_up: { label: "Picked Up", variant: "warning" },
  on_the_way: { label: "On the Way", variant: "warning" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

const STATUSES = ["placed", "confirmed", "packed", "picked_up", "on_the_way", "delivered", "cancelled"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, activeDeliveries: 0, agents: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const today = new Date(); today.setHours(0, 0, 0, 0);

      const [{ data: orders }, { data: recent }, { data: agentsData }] = await Promise.all([
        supabase.from("orders").select("total, status").gte("created_at", today.toISOString()),
        supabase.from("orders").select("*, users(full_name)").order("created_at", { ascending: false }).limit(20),
        supabase.from("delivery_agents").select("*, users!delivery_agents_user_id_fkey(full_name)").eq("is_online", true).is("current_order_id", null),
      ]);

      // Load offline guest orders from localStorage
      const savedHist = localStorage.getItem("mock-orders-history");
      const offlineOrders = savedHist ? JSON.parse(savedHist) : [];
      const formattedOffline = offlineOrders.map((o: any) => ({
        ...o,
        users: { full_name: "Guest User (Offline)" }
      }));

      // Combine both DB and offline orders
      const combinedTodayOrders = [...offlineOrders, ...(orders || [])];
      const combinedRecent = [...formattedOffline, ...(recent || [])].slice(0, 20);

      const revenue = combinedTodayOrders.filter((o) => o.status !== "cancelled").reduce((s: number, o: any) => s + (o.total || 0), 0);
      const active = combinedTodayOrders.filter((o) => ["placed", "confirmed", "packed", "picked_up", "on_the_way"].includes(o.status)).length;

      const dbAgents = agentsData || [];
      const mockAgentObj = {
        user_id: "mock-agent-123",
        is_online: true,
        users: { full_name: "Mock Delivery Agent (Demo)" }
      };

      setStats({ 
        orders: combinedTodayOrders.length, 
        revenue, 
        activeDeliveries: active, 
        agents: dbAgents.length + 1
      });
      setRecentOrders(combinedRecent);
      setAgents([mockAgentObj, ...dbAgents]);
    }
    load();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    if (orderId.startsWith("mock-")) {
      const savedHist = localStorage.getItem("mock-orders-history");
      if (savedHist) {
        const currentHist = JSON.parse(savedHist);
        const updated = currentHist.map((o: any) => o.id === orderId ? { ...o, status } : o);
        localStorage.setItem("mock-orders-history", JSON.stringify(updated));
        
        const specific = localStorage.getItem(orderId);
        if (specific) {
          const parsed = JSON.parse(specific);
          localStorage.setItem(orderId, JSON.stringify({ ...parsed, status }));
        }
      }
      setRecentOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      if (selected?.id === orderId) setSelected((p: any) => ({ ...p, status }));
      toast.success("Status updated locally");
      return;
    }

    const { error } = await (supabase as any).from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
    if (error) { toast.error("Failed to update"); return; }
    setRecentOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    if (selected?.id === orderId) setSelected((p: any) => ({ ...p, status }));
    toast.success("Status updated");
  };

  const assignAgent = async (orderId: string, agentUserId: string) => {
    if (orderId.startsWith("mock-")) {
      const savedHist = localStorage.getItem("mock-orders-history");
      if (savedHist) {
        const currentHist = JSON.parse(savedHist);
        const updated = currentHist.map((o: any) => o.id === orderId ? { ...o, delivery_agent_id: agentUserId, status: "confirmed" } : o);
        localStorage.setItem("mock-orders-history", JSON.stringify(updated));
        
        const specific = localStorage.getItem(orderId);
        if (specific) {
          const parsed = JSON.parse(specific);
          localStorage.setItem(orderId, JSON.stringify({ ...parsed, delivery_agent_id: agentUserId, status: "confirmed" }));
        }
      }
      setRecentOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, delivery_agent_id: agentUserId, status: "confirmed" } : o));
      if (selected?.id === orderId) setSelected((p: any) => ({ ...p, delivery_agent_id: agentUserId, status: "confirmed" }));
      toast.success("Agent assigned locally!");
      return;
    }

    const { error } = await (supabase as any).from("orders").update({ delivery_agent_id: agentUserId, status: "confirmed", updated_at: new Date().toISOString() }).eq("id", orderId);
    if (!error) await (supabase as any).from("delivery_agents").update({ current_order_id: orderId }).eq("user_id", agentUserId);
    if (error) { toast.error("Failed to assign"); return; }
    setRecentOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, delivery_agent_id: agentUserId, status: "confirmed" } : o));
    if (selected?.id === orderId) setSelected((p: any) => ({ ...p, delivery_agent_id: agentUserId, status: "confirmed" }));
    toast.success("Agent assigned!");
  };

  const metrics = [
    { label: "Today's Orders", value: stats.orders, icon: ShoppingBag, color: "text-primary" },
    { label: "Revenue Today", value: formatCurrency(stats.revenue), icon: TrendingUp, color: "text-success" },
    { label: "Active Deliveries", value: stats.activeDeliveries, icon: Truck, color: "text-success" },
    { label: "Agents Online", value: stats.agents, icon: Users, color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Dashboard</h1>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary">{m.label}</p>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <p className="font-heading text-3xl font-bold text-text-primary">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-surface">
                  <th className="text-left px-6 py-3 font-semibold text-text-secondary">Order #</th>
                  <th className="text-left px-6 py-3 font-semibold text-text-secondary">Customer</th>
                  <th className="text-left px-6 py-3 font-semibold text-text-secondary">Items</th>
                  <th className="text-left px-6 py-3 font-semibold text-text-secondary">Total</th>
                  <th className="text-left px-6 py-3 font-semibold text-text-secondary">Status</th>
                  <th className="text-left px-6 py-3 font-semibold text-text-secondary">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const s = statusConfig[order.status] || { label: order.status, variant: "outline" };
                  return (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-surface transition-colors cursor-pointer" onClick={() => setSelected(order)}>
                      <td className="px-6 py-4 font-medium text-primary">{order.order_number}</td>
                      <td className="px-6 py-4 text-text-secondary">{order.users?.full_name || "Guest"}</td>
                      <td className="px-6 py-4 text-text-secondary">{Array.isArray(order.items) ? order.items.length : 0} items</td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(order.total || 0)}</td>
                      <td className="px-6 py-4"><Badge variant={s.variant}>{s.label}</Badge></td>
                      <td className="px-6 py-4 text-text-secondary">{format(new Date(order.created_at), "h:mm a")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.order_number}>
        {selected && (
          <div className="space-y-5 text-white">
            <div>
              <p className="text-xs text-neutral-400 mb-1.5 font-medium">Status</p>
              <select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)} className="border border-neutral-800 bg-neutral-950 text-white rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary">
                {STATUSES.map((s) => <option key={s} value={s} className="bg-neutral-900 text-white">{s.replace("_", " ")}</option>)}
              </select>
            </div>
 
            {!selected.delivery_agent_id && agents.length > 0 && (
              <div>
                <p className="text-xs text-neutral-400 mb-1.5 font-medium">Assign Delivery Agent</p>
                <select onChange={(e) => assignAgent(selected.id, e.target.value)} defaultValue="" className="border border-neutral-800 bg-neutral-950 text-white rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary">
                  <option value="" disabled className="bg-neutral-900 text-neutral-400">Select agent…</option>
                  {agents.map((a) => <option key={a.user_id} value={a.user_id} className="bg-neutral-900 text-white">{a.users?.full_name || a.user_id}</option>)}
                </select>
              </div>
            )}
 
            <div>
              <p className="text-xs text-neutral-400 mb-2 font-medium">Items</p>
              {((selected.items as any[]) || []).map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b border-neutral-800">
                  <span className="text-neutral-200">{item.name} × {item.quantity}</span>
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
 
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-neutral-400">Subtotal</span><span>{formatCurrency(selected.subtotal || 0)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">Delivery</span><span>{formatCurrency(selected.delivery_fee || 0)}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-800">
                <span>Total</span><span className="text-primary">{formatCurrency(selected.total || 0)}</span>
              </div>
            </div>
 
            {selected.delivery_address && (
              <div className="pt-2 border-t border-neutral-800">
                <p className="text-xs text-neutral-400 mb-1 font-medium">Delivery To</p>
                <p className="text-sm text-neutral-200 font-medium">{(selected.delivery_address as any).address_line}, {(selected.delivery_address as any).city}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
