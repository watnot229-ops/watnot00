"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { subDays, format, eachDayOfInterval } from "date-fns";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#10B981", "#059669", "#F59E0B", "#6366F1", "#EC4899", "#14B8A6"];

export default function AdminAnalyticsPage() {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const { data: ordersRaw } = await supabase.from("orders").select("created_at, total, status, items").gte("created_at", thirtyDaysAgo).neq("status", "cancelled");
      const orders = (ordersRaw || []) as { created_at: string; total: number | null; status: string; items: any }[];

      if (!orders) return;

      // Build day-by-day data
      const days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });
      const dayMap: Record<string, { date: string; orders: number; revenue: number }> = {};
      days.forEach((d) => {
        const key = format(d, "MMM d");
        dayMap[key] = { date: key, orders: 0, revenue: 0 };
      });

      orders.forEach((o) => {
        const key = format(new Date(o.created_at), "MMM d");
        if (dayMap[key]) {
          dayMap[key].orders += 1;
          dayMap[key].revenue += o.total || 0;
        }
      });

      const chartData = Object.values(dayMap);
      setOrdersData(chartData);
      setRevenueData(chartData);

      // Category breakdown from items
      const catCount: Record<string, number> = {};
      orders.forEach((o) => {
        ((o.items as any[]) || []).forEach((item) => {
          const name = item.name?.split(" ")[0] || "Other";
          catCount[name] = (catCount[name] || 0) + item.quantity;
        });
      });
      setCategoryData(
        Object.entries(catCount).slice(0, 6).map(([name, value]) => ({ name, value }))
      );

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl h-64 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary">Analytics</h1>

      {/* Orders per day */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <h2 className="font-semibold text-white mb-4">Orders per Day (Last 30 Days)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a3a3a3' }} interval={6} />
            <YAxis tick={{ fontSize: 11, fill: '#a3a3a3' }} />
            <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', color: '#fff' }} />
            <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue per day */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <h2 className="font-semibold text-white mb-4">Revenue per Day</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a3a3a3' }} interval={6} />
            <YAxis tick={{ fontSize: 11, fill: '#a3a3a3' }} tickFormatter={(v) => `₹${v}`} />
            <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => formatCurrency(v)} />
            <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category pie */}
      {categoryData.length > 0 && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h2 className="font-semibold text-white mb-4">Top Products by Quantity</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(props: any) => `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} style={{ outline: 'none' }}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', color: '#fff' }} />
              <Legend wrapperStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
