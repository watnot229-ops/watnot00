import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface CartItem {
  product: any;
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadCart() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await (supabase as any).from('cart').select('items').eq('user_id', user.id).single();
        if (data && data.items) {
          setItems(data.items as CartItem[]);
        }
      } else {
        const local = localStorage.getItem('watnot_cart');
        if (local) {
          setItems(JSON.parse(local));
        }
      }
      setIsLoading(false);
    }
    loadCart();
  }, []);

  const saveCart = async (newItems: CartItem[]) => {
    setItems(newItems);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase as any).from('cart').upsert({ user_id: user.id, items: newItems as any });
    } else {
      localStorage.setItem('watnot_cart', JSON.stringify(newItems));
    }
  };

  const addItem = (product: any) => {
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      saveCart(items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      saveCart([...items, { product, quantity: 1 }]);
    }
  };

  const removeItem = (productId: string) => {
    saveCart(items.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    saveCart(items.map(i => {
      if (i.product.id === productId) {
        const newQ = i.quantity + delta;
        return newQ > 0 ? { ...i, quantity: newQ } : i;
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const clearCart = () => saveCart([]);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return { items, isLoading, addItem, removeItem, updateQuantity, clearCart, subtotal };
}
