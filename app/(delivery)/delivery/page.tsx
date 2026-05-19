"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Bike, Package, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DeliveryHomePage() {
  const [agent, setAgent] = useState<any>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      let activeUser: any = user;
      if (!user) {
        activeUser = { id: "mock-agent-123", email: "agent@watnot.com" };
      }
      setUser(activeUser);

      const { data: agentData } = await supabase.from("delivery_agents").select("*").eq("user_id", activeUser.id).single();
      
      let currentAgent: any = agentData;
      if (!agentData) {
        // Rich fallback details for direct demo/testing mode
        currentAgent = {
          id: "mock-agent-123",
          user_id: activeUser.id,
          is_online: true,
          total_deliveries: 42,
          rating: 4.9,
          current_order_id: null
        };
      }

      // Check if there is any local mock order assigned to this agent in localStorage!
      const savedHist = localStorage.getItem("mock-orders-history");
      const offlineOrders = savedHist ? JSON.parse(savedHist) : [];
      const assignedLocalOrder = offlineOrders.find((o: any) => (o.delivery_agent_id === activeUser.id || o.delivery_agent_id === "mock-agent-123") && o.status !== "delivered" && o.status !== "cancelled");
      
      if (assignedLocalOrder) {
        currentAgent.current_order_id = assignedLocalOrder.id;
        setActiveOrder(assignedLocalOrder);
      } else {
        // Look up database orders assigned to this agent (either logged in user or mock agent)
        const { data: dbOrders } = await (supabase as any).from("orders")
          .select("*")
          .or(`delivery_agent_id.eq.${activeUser.id},delivery_agent_id.eq.mock-agent-123`)
          .not("status", "in", '("delivered","cancelled")')
          .order("created_at", { ascending: false });
        
        if (dbOrders && dbOrders.length > 0) {
          currentAgent.current_order_id = dbOrders[0].id;
          setActiveOrder(dbOrders[0]);
        }
      }
      
      setAgent(currentAgent);
      setLoading(false);
    }
    load();
  }, []);

  const toggleOnline = async () => {
    if (!agent) return;
    setToggling(true);
    const { error } = await (supabase as any).from("delivery_agents").update({ is_online: !agent.is_online }).eq("id", agent.id);
    if (!error) { setAgent((p: any) => ({ ...p, is_online: !p.is_online })); toast.success(!agent.is_online ? "You're now Online!" : "You're now Offline"); }
    setToggling(false);
  };

  const updateOrderStatus = async (status: string) => {
    if (!activeOrder) return;
    
    if (activeOrder.id.startsWith("mock-")) {
      const savedHist = localStorage.getItem("mock-orders-history");
      if (savedHist) {
        const currentHist = JSON.parse(savedHist);
        const updated = currentHist.map((o: any) => o.id === activeOrder.id ? { ...o, status } : o);
        localStorage.setItem("mock-orders-history", JSON.stringify(updated));
        
        const specific = localStorage.getItem(activeOrder.id);
        if (specific) {
          const parsed = JSON.parse(specific);
          localStorage.setItem(activeOrder.id, JSON.stringify({ ...parsed, status }));
        }
      }
      setActiveOrder((p: any) => ({ ...p, status }));

      if (status === "delivered") {
        setAgent((p: any) => ({ ...p, current_order_id: null, total_deliveries: (p.total_deliveries || 0) + 1 }));
        setActiveOrder(null);
        toast.success("Order delivered! Great work 🎉");
      } else {
        toast.success(`Status updated to ${status.replace("_", " ")}`);
      }
      return;
    }

    const { error } = await (supabase as any).from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", activeOrder.id);
    if (error) { toast.error("Failed to update"); return; }
    setActiveOrder((p: any) => ({ ...p, status }));

    if (status === "delivered") {
      await (supabase as any).from("delivery_agents").update({ current_order_id: null, total_deliveries: (agent.total_deliveries || 0) + 1 }).eq("id", agent.id);
      setAgent((p: any) => ({ ...p, current_order_id: null, total_deliveries: (p.total_deliveries || 0) + 1 }));
      setActiveOrder(null);
      toast.success("Order delivered! Great work 🎉");
    } else {
      toast.success(`Status updated to ${status.replace("_", " ")}`);
    }
  };

  if (loading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-xl h-24 animate-pulse" />)}</div>;

  const todayEarnings = (agent?.total_deliveries || 0) * 20; // rough estimate

  return (
    <div className="space-y-4">
      {/* Online toggle */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold mb-1">Hello, Agent! 👋</h1>
            <p className="text-gray-400 text-sm">{agent?.is_online ? "You're online and ready" : "You're currently offline"}</p>
          </div>
          <div className={`w-16 h-8 rounded-full relative cursor-pointer transition-colors ${agent?.is_online ? "bg-success" : "bg-gray-600"}`} onClick={toggleOnline}>
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${agent?.is_online ? "translate-x-8" : "translate-x-1"}`} />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-xs">Total Deliveries</p>
            <p className="font-heading font-bold text-2xl">{agent?.total_deliveries || 0}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Rating</p>
            <p className="font-heading font-bold text-2xl">⭐ {agent?.rating?.toFixed(1) || "5.0"}</p>
          </div>
        </div>
      </div>

      {/* Active order */}
      {activeOrder ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Active Order</h2>
          </div>

          <div className="mb-3">
            <p className="font-bold text-primary">{activeOrder.order_number}</p>
            <p className="text-sm text-text-secondary mt-0.5">
              {(activeOrder.delivery_address as any)?.address_line}, {(activeOrder.delivery_address as any)?.city}
            </p>
          </div>

          <div className="space-y-1 mb-4">
            {((activeOrder.items as any[]) || []).map((item: any, i: number) => (
              <p key={i} className="text-sm">{item.name} × {item.quantity}</p>
            ))}
          </div>

          {activeOrder.payment_method === "cod" && (
            <div className="bg-emerald-500/10 rounded-lg p-3 mb-4 text-sm">
              <p className="font-semibold text-emerald-400">Collect COD: {formatCurrency(activeOrder.total || 0)}</p>
            </div>
          )}

          <div className="flex gap-2">
            {activeOrder.status === "confirmed" || activeOrder.status === "packed" ? (
              <Button className="flex-1" onClick={() => updateOrderStatus("picked_up")}>
                <Bike className="w-4 h-4 mr-2" /> Mark Picked Up
              </Button>
            ) : activeOrder.status === "picked_up" || activeOrder.status === "on_the_way" ? (
              <>
                <Button variant="secondary" className="flex-1" onClick={() => updateOrderStatus("on_the_way")}>On the Way</Button>
                <Button className="flex-1" onClick={() => updateOrderStatus("delivered")}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Delivered
                </Button>
              </>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <Bike className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-text-primary">No active order</p>
          <p className="text-sm text-text-secondary mt-1">{agent?.is_online ? "Waiting for an assignment…" : "Go online to receive orders"}</p>
        </div>
      )}

      <Link href="/delivery/orders" className="block">
        <Button variant="outline" className="w-full">View Order History</Button>
      </Link>
    </div>
  );
}
