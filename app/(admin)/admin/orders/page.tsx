"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";

const STATUSES = ["placed", "confirmed", "packed", "picked_up", "on_the_way", "delivered", "cancelled"];

const statusConfig: Record<string, { variant: any }> = {
  placed: { variant: "outline" },
  confirmed: { variant: "default" },
  packed: { variant: "warning" },
  picked_up: { variant: "warning" },
  on_the_way: { variant: "warning" },
  delivered: { variant: "success" },
  cancelled: { variant: "danger" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [agents, setAgents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [{ data: ordersData }, { data: agentsData }] = await Promise.all([
        supabase.from("orders").select("*, users!orders_customer_id_fkey(full_name, email), delivery_agents(user_id, is_online)").order("created_at", { ascending: false }),
        supabase.from("delivery_agents").select("*, users!delivery_agents_user_id_fkey(full_name)").eq("is_online", true).is("current_order_id", null),
      ]);
      
      const savedHist = localStorage.getItem("mock-orders-history");
      const offlineOrders = savedHist ? JSON.parse(savedHist) : [];
      const formattedOffline = offlineOrders.map((o: any) => ({
        ...o,
        users: { full_name: "Guest User (Offline)", email: "guest@indiabullsgreens.com" }
      }));

      const dbAgents = agentsData || [];
      const mockAgentObj = {
        user_id: "mock-agent-123",
        is_online: true,
        users: { full_name: "Mock Delivery Agent (Demo)" }
      };

      setOrders([...formattedOffline, ...(ordersData || [])]);
      setAgents([mockAgentObj, ...dbAgents]);
      setLoading(false);
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
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      if (selected?.id === orderId) setSelected((p: any) => ({ ...p, status }));
      toast.success("Status updated locally");
      return;
    }

    const { error } = await (supabase as any).from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
    if (error) { toast.error("Failed to update"); return; }
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
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
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, delivery_agent_id: agentUserId, status: "confirmed" } : o));
      toast.success("Agent assigned locally!");
      return;
    }

    const { error } = await (supabase as any).from("orders").update({ delivery_agent_id: agentUserId, status: "confirmed", updated_at: new Date().toISOString() }).eq("id", orderId);
    if (!error) await (supabase as any).from("delivery_agents").update({ current_order_id: orderId }).eq("user_id", agentUserId);
    if (error) { toast.error("Failed to assign"); return; }
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, delivery_agent_id: agentUserId, status: "confirmed" } : o));
    toast.success("Agent assigned!");
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === s ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-gray-200 hover:border-primary"}`}>
            {s === "all" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-surface">
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">Items</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-6 bg-surface rounded animate-pulse" /></td></tr>
              ))}
              {filtered.map((order) => {
                const s = statusConfig[order.status] || { variant: "outline" };
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-surface/50 transition-colors cursor-pointer" onClick={() => setSelected(order)}>
                    <td className="px-4 py-4 font-medium text-primary">{order.order_number}</td>
                    <td className="px-4 py-4 text-text-secondary">{order.users?.full_name || "—"}</td>
                    <td className="px-4 py-4">{Array.isArray(order.items) ? order.items.length : 0}</td>
                    <td className="px-4 py-4 font-medium">{formatCurrency(order.total || 0)}</td>
                    <td className="px-4 py-4"><Badge variant={s.variant}>{order.status.replace("_", " ")}</Badge></td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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
