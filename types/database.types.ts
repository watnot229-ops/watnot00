export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'customer' | 'admin' | 'delivery'
          created_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin' | 'delivery'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin' | 'delivery'
          created_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string | null
          label: string | null
          address_line: string | null
          city: string | null
          pincode: string | null
          lat: number | null
          lng: number | null
          is_default: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          label?: string | null
          address_line?: string | null
          city?: string | null
          pincode?: string | null
          lat?: number | null
          lng?: number | null
          is_default?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          label?: string | null
          address_line?: string | null
          city?: string | null
          pincode?: string | null
          lat?: number | null
          lng?: number | null
          is_default?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string | null
          icon_url: string | null
          display_order: number
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          icon_url?: string | null
          display_order?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          icon_url?: string | null
          display_order?: number
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          mrp: number | null
          image_url: string | null
          unit: string | null
          stock_qty: number
          is_available: boolean
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          mrp?: number | null
          image_url?: string | null
          unit?: string | null
          stock_qty?: number
          is_available?: boolean
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          mrp?: number | null
          image_url?: string | null
          unit?: string | null
          stock_qty?: number
          is_available?: boolean
          is_featured?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          delivery_agent_id: string | null
          delivery_address: Json | null
          items: Json
          subtotal: number | null
          delivery_fee: number | null
          discount: number | null
          total: number | null
          payment_method: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          status: 'placed' | 'confirmed' | 'packed' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled'
          estimated_delivery: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          customer_id?: string | null
          delivery_agent_id?: string | null
          delivery_address?: Json | null
          items: Json
          subtotal?: number | null
          delivery_fee?: number | null
          discount?: number | null
          total?: number | null
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          status?: 'placed' | 'confirmed' | 'packed' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled'
          estimated_delivery?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string | null
          delivery_agent_id?: string | null
          delivery_address?: Json | null
          items?: Json
          subtotal?: number | null
          delivery_fee?: number | null
          discount?: number | null
          total?: number | null
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          status?: 'placed' | 'confirmed' | 'packed' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled'
          estimated_delivery?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string | null
          items: Json | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          items?: Json | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          items?: Json | null
          updated_at?: string
        }
      }
      delivery_agents: {
        Row: {
          id: string
          user_id: string | null
          is_online: boolean
          current_lat: number | null
          current_lng: number | null
          current_order_id: string | null
          total_deliveries: number
          rating: number
        }
        Insert: {
          id?: string
          user_id?: string | null
          is_online?: boolean
          current_lat?: number | null
          current_lng?: number | null
          current_order_id?: string | null
          total_deliveries?: number
          rating?: number
        }
        Update: {
          id?: string
          user_id?: string | null
          is_online?: boolean
          current_lat?: number | null
          current_lng?: number | null
          current_order_id?: string | null
          total_deliveries?: number
          rating?: number
        }
      }
      coupons: {
        Row: {
          id: string
          code: string | null
          discount_type: 'flat' | 'percent' | null
          discount_value: number | null
          min_order_value: number | null
          max_uses: number | null
          used_count: number | null
          is_active: boolean
          expires_at: string | null
        }
        Insert: {
          id?: string
          code?: string | null
          discount_type?: 'flat' | 'percent' | null
          discount_value?: number | null
          min_order_value?: number | null
          max_uses?: number | null
          used_count?: number | null
          is_active?: boolean
          expires_at?: string | null
        }
        Update: {
          id?: string
          code?: string | null
          discount_type?: 'flat' | 'percent' | null
          discount_value?: number | null
          min_order_value?: number | null
          max_uses?: number | null
          used_count?: number | null
          is_active?: boolean
          expires_at?: string | null
        }
      }
    }
  }
}
