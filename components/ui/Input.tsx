import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "w-full h-12 px-4 rounded-md border bg-zinc-950 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-shadow",
            error ? "border-danger focus:ring-danger/20" : "border-zinc-800 focus:border-primary focus:ring-primary/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger mt-1.5">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
