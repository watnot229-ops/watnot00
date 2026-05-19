import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary text-white",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    outline: "border border-gray-200 text-text-secondary",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
