"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRealtimeOrder } from "@/hooks/useRealtimeOrder";
import { OrderStatusStepper } from "@/components/features/OrderStatusStepper";
import { DeliveryMap } from "@/components/features/DeliveryMap";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const order = useRealtimeOrder(id);
  const [agentData, setAgentData] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Load agent location
  useEffect(() => {
    if (!order?.delivery_agent_id) return;
    async function loadAgent() {
      const { data } = await (supabase as any).from("delivery_agents").select("*").eq("user_id", order!.delivery_agent_id).single();
      setAgentData(data);
    }
    loadAgent();

    // Poll every 30s
    const interval = setInterval(loadAgent, 30000);
    return () => clearInterval(interval);
  }, [order?.delivery_agent_id]);

  const cancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    const { error } = await (supabase as any).from("orders").update({ status: "cancelled" }).eq("id", order.id);
    if (error) { toast.error("Failed to cancel order"); }
    else { toast.success("Order cancelled"); }
    setCancelling(false);
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-surface rounded-xl h-24 animate-pulse" />)}
        </div>
      </div>
    );
  }

  const canCancel = ["placed", "confirmed"].includes(order.status);
  const deliveryAddr = order.delivery_address as any;
  const items = (order.items as any[]) || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="bg-surface rounded-xl border border-zinc-800 p-5">
        <p className="text-xs text-text-secondary">Order</p>
        <h1 className="font-heading text-xl font-bold text-text-primary">{order.order_number}</h1>
        <p className="text-sm text-text-secondary mt-1">{format(new Date(order.created_at), "d MMM yyyy, h:mm a")}</p>

        {order.estimated_delivery && order.status !== "delivered" && order.status !== "cancelled" && (
          <div className="flex items-center gap-2 mt-3 text-primary font-medium">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Est. delivery: {format(new Date(order.estimated_delivery), "h:mm a")}</span>
          </div>
        )}
      </div>

      {/* Status stepper */}
      <div className="bg-surface rounded-xl border border-zinc-800 p-5">
        <h2 className="font-semibold mb-4">Order Status</h2>
        <OrderStatusStepper status={order.status} />
      </div>

      {/* Live Map */}
      {["picked_up", "on_the_way"].includes(order.status) && (
        <div className="bg-surface rounded-xl border border-zinc-800 p-5">
          <h2 className="font-semibold mb-3">Live Tracking</h2>
          <DeliveryMap
            agentLat={agentData?.current_lat}
            agentLng={agentData?.current_lng}
            deliveryLat={deliveryAddr?.lat}
            deliveryLng={deliveryAddr?.lng}
          />
        </div>
      )}

      {/* Items */}
      <div className="bg-surface rounded-xl border border-zinc-800 p-5">
        <h2 className="font-semibold mb-3">Items Ordered</h2>
        <div className="space-y-2">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-text-secondary">{item.name} × {item.quantity}</span>
              <span className="text-primary font-semibold">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-800 mt-3 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-text-secondary">Subtotal</span><span className="text-primary font-semibold">{formatCurrency(order.subtotal || 0)}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Delivery</span><span className="text-primary font-semibold">{formatCurrency(order.delivery_fee || 0)}</span></div>
          {(order.discount || 0) > 0 && <div className="flex justify-between text-success"><span>Discount</span><span className="text-primary font-semibold">-{formatCurrency(order.discount || 0)}</span></div>}
          <div className="flex justify-between font-bold text-base border-t border-zinc-800 pt-2">
            <span>Total</span><span className="text-primary font-bold text-lg">{formatCurrency(order.total || 0)}</span>
          </div>
        </div>
      </div>

      {/* Delivery address */}
      {deliveryAddr && (
        <div className="bg-surface rounded-xl border border-zinc-800 p-5">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold mb-1">Delivery Address</h2>
              <p className="text-sm text-text-secondary">{deliveryAddr.address_line}, {deliveryAddr.city} – {deliveryAddr.pincode}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cancel button */}
      {canCancel && (
        <Button variant="danger" size="md" className="w-full" onClick={cancelOrder} isLoading={cancelling}>
          Cancel Order
        </Button>
      )}
    </div>
  );
}
