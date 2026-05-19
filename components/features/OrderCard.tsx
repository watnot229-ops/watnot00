"use client";

import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "outline" }> = {
  placed: { label: "Placed", variant: "outline" },
  confirmed: { label: "Confirmed", variant: "default" },
  packed: { label: "Packed", variant: "warning" },
  picked_up: { label: "Picked Up", variant: "warning" },
  on_the_way: { label: "On the Way", variant: "warning" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

interface OrderCardProps {
  order: any;
}

export function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status] || { label: order.status, variant: "outline" as const };

  return (
    <Link href={`/orders/${order.id}`} className="block">
      <div className="bg-surface border border-zinc-800 rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-text-secondary">Order</p>
            <p className="font-heading font-bold text-text-primary">{order.order_number}</p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="text-sm text-text-secondary">
          {Array.isArray(order.items) ? `${order.items.length} item(s)` : "Items"}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
          <span className="text-xs text-text-secondary">
            {format(new Date(order.created_at), "d MMM, h:mm a")}
          </span>
          <span className="font-bold text-primary">{formatCurrency(order.total || 0)}</span>
        </div>
      </div>
    </Link>
  );
}
