"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Package, Truck, MapPin, ShoppingBag } from "lucide-react";

const STATUS_STEPS = [
  { key: "placed", label: "Order Placed", icon: ShoppingBag },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Package },
  { key: "picked_up", label: "Picked Up", icon: Truck },
  { key: "on_the_way", label: "On the Way", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const STATUS_ORDER = ["placed", "confirmed", "packed", "picked_up", "on_the_way", "delivered"];

interface OrderStatusStepperProps {
  status: string;
}

export function OrderStatusStepper({ status }: OrderStatusStepperProps) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-danger">
        <Circle className="w-5 h-5" />
        <span className="font-semibold">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="w-full">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIndex;
        const active = idx === currentIndex;

        return (
          <div key={step.key} className="flex items-start gap-3">
            {/* Icon + connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500",
                  done ? "bg-primary text-white" : "bg-gray-100 text-gray-300"
                )}
              >
                <step.icon className="w-4 h-4" />
              </div>
              {idx < STATUS_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[24px] transition-all duration-700",
                    idx < currentIndex ? "bg-primary" : "bg-gray-200"
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-4 pt-1.5">
              <p
                className={cn(
                  "font-medium text-sm transition-colors",
                  active ? "text-primary font-bold" : done ? "text-text-primary" : "text-gray-300"
                )}
              >
                {step.label}
              </p>
              {active && (
                <p className="text-xs text-text-secondary mt-0.5 animate-pulse">In progress…</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
