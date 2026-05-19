"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

export default function AdminDeliveryAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("delivery_agents")
      .select("*, users!delivery_agents_user_id_fkey(full_name, email, phone)");
    setAgents(data || []);
    setLoading(false);
  }

  const toggleOnline = async (agentId: string, current: boolean) => {
    const { error } = await (supabase as any).from("delivery_agents").update({ is_online: !current }).eq("id", agentId);
    if (error) { toast.error("Failed to update"); return; }
    setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, is_online: !current } : a));
    toast.success(!current ? "Agent set online" : "Agent set offline");
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Delivery Agents</h1>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-surface">
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Agent</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Current Order</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Deliveries</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Rating</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-5 bg-surface rounded animate-pulse" /></td></tr>
              )) : agents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-50 hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium">{agent.users?.full_name || "—"}</p>
                    <p className="text-xs text-text-secondary">{agent.users?.email || agent.users?.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={agent.is_online ? "success" : "outline"}>
                      {agent.is_online ? "Online" : "Offline"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {agent.current_order_id ? <span className="text-warning font-medium">Active order</span> : "—"}
                  </td>
                  <td className="px-5 py-4 font-medium">{agent.total_deliveries}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                      <span>{agent.rating?.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleOnline(agent.id, agent.is_online)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${agent.is_online ? "border-danger/20 text-danger hover:bg-danger/5" : "border-success/20 text-success hover:bg-success/5"}`}
                    >
                      {agent.is_online ? "Set Offline" : "Set Online"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
