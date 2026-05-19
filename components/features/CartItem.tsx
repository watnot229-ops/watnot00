"use client";

import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

interface CartItemProps {
  item: {
    product: any;
    quantity: number;
  };
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 py-4 border-b border-gray-100 last:border-0">
      {/* Image */}
      <div className="relative w-16 h-16 bg-surface rounded-lg overflow-hidden shrink-0">
        {item.product.image_url ? (
          <Image
            src={item.product.image_url}
            alt={item.product.name}
            fill
            unoptimized={item.product.image_url.startsWith("/api/images/product")}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-text-primary line-clamp-1">{item.product.name}</p>
        <p className="text-xs text-text-secondary">{item.product.unit}</p>
        <p className="text-sm font-bold text-primary mt-1">{formatCurrency(item.product.price)}</p>
      </div>

      {/* Quantity stepper */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => item.quantity === 1 ? removeItem(item.product.id) : updateQuantity(item.product.id, -1)}
            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-surface transition-colors"
          >
            {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-danger" /> : <Minus className="w-3 h-3" />}
          </button>
          <span className="w-6 text-center text-sm font-bold text-text-primary">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, 1)}
            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-surface transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-right shrink-0 w-16">
        <p className="text-sm font-bold text-primary">{formatCurrency(item.product.price * item.quantity)}</p>
      </div>
    </div>
  );
}
