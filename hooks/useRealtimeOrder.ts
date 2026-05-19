import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

type Order = Database['public']['Tables']['orders']['Row'];

export function useRealtimeOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!orderId) return;

    if (orderId.startsWith("mock-")) {
      const saved = localStorage.getItem(orderId);
      if (saved) {
        setOrder(JSON.parse(saved));
      } else {
        // Fallback demo order
        setOrder({
          id: orderId,
          order_number: "WN-MOCK-" + orderId.substring(5, 9).toUpperCase(),
          customer_id: "mock-customer-123",
          delivery_address: { address_line: "Flat 402, Tower 4, Indiabulls Greens", city: "Panvel, Navi Mumbai", pincode: "410206" },
          items: [{ name: "Fresh Tomatoes", quantity: 2, price: 29, unit: "500g" }],
          subtotal: 58,
          delivery_fee: 20,
          discount: 0,
          total: 78,
          payment_method: "cod",
          payment_status: "pending",
          status: "placed",
          estimated_delivery: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          delivery_agent_id: null,
          notes: null
        } as any);
      }
      return;
    }

    // Fetch initial order
    supabase.from('orders').select('*').eq('id', orderId).single().then(({ data }) => {
      if (data) setOrder(data);
    });

    // Subscribe to changes
    const channel = supabase.channel(`order_${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return order;
}
