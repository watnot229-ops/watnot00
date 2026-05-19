"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/features/CartItem";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCart, Tag, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleProceedToCheckout = (e: React.MouseEvent) => {
    const savedSession = localStorage.getItem("mock-user-session");
    if (!savedSession) {
      e.preventDefault();
      toast.error("Please sign in or register to place your order!");
      router.push("/auth?redirect=/checkout");
    }
  };

  const deliveryFee = subtotal > 0 ? 20 : 0;
  const discount = coupon
    ? coupon.discount_type === "flat"
      ? Math.min(coupon.discount_value, subtotal)
      : (subtotal * coupon.discount_value) / 100
    : 0;
  const total = subtotal + deliveryFee - discount;

  const applyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    const { data, error } = await (supabase as any)
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !data) {
      toast.error("Invalid or expired coupon");
      setCoupon(null);
    } else if (subtotal < (data.min_order_value || 0)) {
      toast.error(`Minimum order ₹${data.min_order_value} required`);
      setCoupon(null);
    } else {
      setCoupon(data);
      toast.success(`Coupon "${data.code}" applied!`);
    }
    setCouponLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">Your cart is empty</h1>
        <p className="text-text-secondary mb-6">Add some products to get started</p>
        <Link href="/">
          <Button variant="primary">Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-zinc-800 p-4">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-surface rounded-xl border border-zinc-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-sm">Apply Coupon</h2>
            </div>
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-primary uppercase"
              />
              <Button
                size="sm"
                variant={coupon ? "secondary" : "primary"}
                onClick={coupon ? () => { setCoupon(null); setCouponCode(""); } : applyCoupon}
                isLoading={couponLoading}
              >
                {coupon ? "Remove" : "Apply"}
              </Button>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-surface rounded-xl border border-zinc-800 p-4 space-y-3">
            <h2 className="font-semibold">Price Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-primary font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Delivery Fee</span>
                <span className="text-primary font-semibold">{formatCurrency(deliveryFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount ({coupon?.code})</span>
                  <span className="text-primary font-semibold">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-zinc-800">
                <span>Total</span>
                <span className="text-primary font-bold text-lg">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <Link
            href={{
              pathname: "/checkout",
              query: coupon ? { coupon: coupon.code, discount: discount.toFixed(2) } : {},
            }}
            onClick={handleProceedToCheckout}
          >
            <Button variant="primary" size="lg" className="w-full">
              Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
