"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { useState as useImgState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    mrp?: number | null;
    image_url?: string | null;
    unit?: string | null;
    is_available?: boolean;
    category_id?: string | null;
  };
}

// Category emoji + gradient map
const CATEGORY_STYLES: Record<string, { emoji: string; gradient: string }> = {
  "fruits-veggies":  { emoji: "🥦", gradient: "from-green-100 to-emerald-200" },
  "dairy-eggs":      { emoji: "🥛", gradient: "from-blue-50 to-sky-100" },
  "meat-seafood":    { emoji: "🍗", gradient: "from-red-100 to-orange-100" },
  "snacks":          { emoji: "🍿", gradient: "from-yellow-100 to-amber-100" },
  "beverages":       { emoji: "🥤", gradient: "from-purple-100 to-pink-100" },
  "bakery":          { emoji: "🍞", gradient: "from-orange-100 to-yellow-100" },
  "staples-grains":  { emoji: "🌾", gradient: "from-amber-100 to-yellow-50" },
  "breakfast":       { emoji: "🥣", gradient: "from-orange-50 to-yellow-100" },
  "frozen-foods":    { emoji: "🧊", gradient: "from-cyan-100 to-blue-100" },
  "cleaning":        { emoji: "🧹", gradient: "from-teal-100 to-cyan-100" },
  "personal-care":   { emoji: "🧴", gradient: "from-pink-100 to-rose-100" },
  "pet-care":        { emoji: "🐾", gradient: "from-amber-100 to-orange-50" },
  "baby-care":       { emoji: "👶", gradient: "from-pink-50 to-purple-100" },
  "condiments":      { emoji: "🫙", gradient: "from-red-50 to-orange-100" },
  "instant-food":    { emoji: "🍜", gradient: "from-yellow-100 to-orange-100" },
};

const DEFAULT_STYLE = { emoji: "🛒", gradient: "from-gray-100 to-gray-200" };

// Derive slug from product name for emoji matching (fallback)
function getProductEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("milk") || n.includes("dairy")) return "🥛";
  if (n.includes("egg")) return "🥚";
  if (n.includes("chicken")) return "🍗";
  if (n.includes("mutton") || n.includes("lamb")) return "🥩";
  if (n.includes("fish") || n.includes("salmon") || n.includes("tuna") || n.includes("prawn") || n.includes("seafood") || n.includes("crab") || n.includes("squid")) return "🐟";
  if (n.includes("beef") || n.includes("pork")) return "🥩";
  if (n.includes("bread") || n.includes("bun") || n.includes("croissant") || n.includes("roll")) return "🍞";
  if (n.includes("cake") || n.includes("brownie") || n.includes("muffin") || n.includes("cookie") || n.includes("cupcake")) return "🧁";
  if (n.includes("apple")) return "🍎";
  if (n.includes("banana")) return "🍌";
  if (n.includes("mango")) return "🥭";
  if (n.includes("watermelon")) return "🍉";
  if (n.includes("grape")) return "🍇";
  if (n.includes("tomato")) return "🍅";
  if (n.includes("onion")) return "🧅";
  if (n.includes("garlic")) return "🧄";
  if (n.includes("carrot")) return "🥕";
  if (n.includes("corn")) return "🌽";
  if (n.includes("avocado")) return "🥑";
  if (n.includes("lemon")) return "🍋";
  if (n.includes("orange")) return "🍊";
  if (n.includes("pomegranate")) return "🍎";
  if (n.includes("spinach") || n.includes("broccoli") || n.includes("cauliflower")) return "🥦";
  if (n.includes("pepper")) return "🫑";
  if (n.includes("butter") || n.includes("ghee")) return "🧈";
  if (n.includes("cheese")) return "🧀";
  if (n.includes("curd") || n.includes("yogurt") || n.includes("lassi")) return "🫙";
  if (n.includes("paneer")) return "🧀";
  if (n.includes("cola") || n.includes("pepsi") || n.includes("sprite") || n.includes("fanta") || n.includes("thums up")) return "🥤";
  if (n.includes("water")) return "💧";
  if (n.includes("juice") || n.includes("drink")) return "🧃";
  if (n.includes("coffee") || n.includes("nescafe") || n.includes("bru")) return "☕";
  if (n.includes("tea")) return "🍵";
  if (n.includes("energy") || n.includes("red bull") || n.includes("monster")) return "⚡";
  if (n.includes("chips") || n.includes("lays") || n.includes("pringles") || n.includes("doritos")) return "🍟";
  if (n.includes("biscuit") || n.includes("cookie") || n.includes("oreo")) return "🍪";
  if (n.includes("noodle") || n.includes("maggi")) return "🍜";
  if (n.includes("popcorn")) return "🍿";
  if (n.includes("nuts") || n.includes("cashew") || n.includes("almond")) return "🥜";
  if (n.includes("rice")) return "🍚";
  if (n.includes("dal") || n.includes("lentil") || n.includes("chana") || n.includes("rajma")) return "🫘";
  if (n.includes("flour") || n.includes("atta") || n.includes("maida")) return "🌾";
  if (n.includes("oil") || n.includes("olive")) return "🫙";
  if (n.includes("sugar") || n.includes("salt")) return "🧂";
  if (n.includes("oat")) return "🥣";
  if (n.includes("sausage") || n.includes("salami")) return "🌭";
  if (n.includes("soap") || n.includes("shampoo") || n.includes("cream") || n.includes("gel")) return "🧴";
  if (n.includes("toothpaste") || n.includes("brush")) return "🪥";
  if (n.includes("detergent") || n.includes("cleaner") || n.includes("cleaning")) return "🧹";
  if (n.includes("pet") || n.includes("dog") || n.includes("cat")) return "🐾";
  if (n.includes("baby") || n.includes("diaper")) return "👶";
  if (n.includes("sauce") || n.includes("ketchup") || n.includes("condiment")) return "🍶";
  return "🛍️";
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useImgState(false);

  const cartItem = items.find((i) => i.product.id === product.id);
  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const emoji = getProductEmoji(product.name);
  const style = DEFAULT_STYLE;

  const handleAdd = async () => {
    setAdding(true);
    addItem(product);
    setTimeout(() => setAdding(false), 400);
  };

  const dynamicImageUrl = `/api/images/product?name=${encodeURIComponent(product.name)}&category=${product.category_id || "default"}`;

  return (
    <div className="bg-surface rounded-xl border border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image / Vector Illustration */}
      <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-zinc-950">
        {!imgError ? (
          <Image
            src={product.image_url || dynamicImageUrl}
            alt={product.name}
            fill
            unoptimized={!product.image_url || product.image_url.startsWith("/api/images/product")}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-5xl select-none group-hover:scale-110 transition-transform duration-200">
            {emoji}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-success text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-text-secondary leading-tight">{product.unit}</p>
        <h3 className="font-semibold text-sm text-text-primary leading-snug mt-0.5 line-clamp-2 flex-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-2 gap-1">
          <div className="min-w-0">
            <span className="font-bold text-sm text-primary">{formatCurrency(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-text-secondary line-through ml-1">
                {formatCurrency(product.mrp)}
              </span>
            )}
          </div>

          {!product.is_available ? (
            <span className="text-xs text-text-secondary shrink-0">Out of stock</span>
          ) : cartItem ? (
            <div className="flex items-center gap-0.5 bg-primary rounded-lg overflow-hidden shrink-0">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                className="w-7 h-7 flex items-center justify-center text-white hover:bg-primary-hover transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-white text-sm font-bold w-4 text-center">{cartItem.quantity}</span>
              <button
                onClick={() => addItem(product)}
                className="w-7 h-7 flex items-center justify-center text-white hover:bg-primary-hover transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={adding}
              className="flex items-center gap-1 bg-primary text-white text-xs font-bold px-2.5 h-7 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-70 shrink-0"
            >
              <Plus className="w-3 h-3" />
              {adding ? "…" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
