-- Initial Schema for Watnot

-- Users extension (assumes auth.users exists in Supabase)
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  phone text UNIQUE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'delivery')),
  created_at timestamptz DEFAULT now()
);

-- Addresses
CREATE TABLE public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  label text,
  address_line text,
  city text,
  pincode text,
  lat float8,
  lng float8,
  is_default boolean DEFAULT false
);

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  icon_url text,
  display_order int DEFAULT 0
);

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  mrp numeric(10,2),
  image_url text,
  unit text,
  stock_qty int DEFAULT 100,
  is_available boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE DEFAULT 'WN-' || to_char(now(), 'YYYYMMDD') || '-' || floor(random()*9000+1000)::text,
  customer_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  delivery_agent_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  delivery_address jsonb,
  items jsonb NOT NULL,
  subtotal numeric(10,2),
  delivery_fee numeric(10,2) DEFAULT 20,
  discount numeric(10,2) DEFAULT 0,
  total numeric(10,2),
  payment_method text DEFAULT 'cod',
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  status text DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'packed', 'picked_up', 'on_the_way', 'delivered', 'cancelled')),
  estimated_delivery timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart
CREATE TABLE public.cart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  items jsonb DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

-- Delivery Agents
CREATE TABLE public.delivery_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  is_online boolean DEFAULT false,
  current_lat float8,
  current_lng float8,
  current_order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  total_deliveries int DEFAULT 0,
  rating float4 DEFAULT 5.0
);

-- Coupons
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  discount_type text CHECK (discount_type IN ('flat', 'percent')),
  discount_value numeric(10,2),
  min_order_value numeric(10,2) DEFAULT 0,
  max_uses int DEFAULT 100,
  used_count int DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Policies for Categories (Public Read, Admin Write)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin can insert categories" ON public.categories FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin can update categories" ON public.categories FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Policies for Products (Public Read, Admin Write)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin can insert products" ON public.products FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin can update products" ON public.products FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Policies for Users
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Policies for Orders
CREATE POLICY "customers_own_orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "customers_insert_orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "customers_update_cancelled" ON public.orders FOR UPDATE USING (auth.uid() = customer_id) WITH CHECK (status = 'cancelled');
CREATE POLICY "admin_all_orders" ON public.orders FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "delivery_assigned_orders" ON public.orders FOR SELECT USING (auth.uid() = delivery_agent_id);
CREATE POLICY "delivery_update_status" ON public.orders FOR UPDATE USING (auth.uid() = delivery_agent_id) WITH CHECK (status IN ('picked_up', 'on_the_way', 'delivered'));

-- Policies for Cart
CREATE POLICY "Users manage own cart" ON public.cart FOR ALL USING (auth.uid() = user_id);

-- Policies for Addresses
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Policies for Delivery Agents
CREATE POLICY "Agents can view own record" ON public.delivery_agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Agents can update own record" ON public.delivery_agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin can view/manage all agents" ON public.delivery_agents FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view agent locations for orders" ON public.delivery_agents FOR SELECT USING (true);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
