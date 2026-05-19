"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";
import { format } from "date-fns";

const emptyForm = { code: "", discount_type: "flat" as "flat" | "percent", discount_value: "", min_order_value: "0", max_uses: "100", expires_at: "" };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("coupons").select("*").order("created_at" as any, { ascending: false });
    setCoupons(data || []);
    setLoading(false);
  }

  const save = async () => {
    if (!form.code || !form.discount_value) { toast.error("Fill required fields"); return; }
    setSaving(true);
    const { error } = await (supabase.from("coupons") as any).insert({
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_order_value: parseFloat(form.min_order_value) || 0,
      max_uses: parseInt(form.max_uses) || 100,
      expires_at: form.expires_at || null,
    });
    setSaving(false);
    if (error) { toast.error("Failed to create coupon"); return; }
    toast.success("Coupon created!");
    setShowForm(false);
    setForm({ ...emptyForm });
    load();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await (supabase as any).from("coupons").update({ is_active: !current }).eq("id", id);
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !current } : c));
    toast.success(!current ? "Coupon activated" : "Coupon deactivated");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Coupons</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-surface">
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Code</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Discount</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Min Order</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Usage</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Expires</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-5 bg-surface rounded animate-pulse" /></td></tr>
              )) : coupons.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-primary">{c.code}</td>
                  <td className="px-5 py-4">{c.discount_type === "flat" ? formatCurrency(c.discount_value) : `${c.discount_value}%`} off</td>
                  <td className="px-5 py-4">{formatCurrency(c.min_order_value || 0)}</td>
                  <td className="px-5 py-4 text-text-secondary">{c.used_count || 0} / {c.max_uses}</td>
                  <td className="px-5 py-4 text-text-secondary">{c.expires_at ? format(new Date(c.expires_at), "d MMM yy") : "No expiry"}</td>
                  <td className="px-5 py-4"><Badge variant={c.is_active ? "success" : "outline"}>{c.is_active ? "Active" : "Inactive"}</Badge></td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleActive(c.id, c.is_active)} className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${c.is_active ? "border-danger/20 text-danger hover:bg-danger/5" : "border-success/20 text-success hover:bg-success/5"}`}>
                      {c.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create coupon modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold">Create Coupon</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-surface rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Coupon Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE50" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary uppercase font-bold tracking-widest" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary">
                    <option value="flat">Flat (₹)</option>
                    <option value="percent">Percent (%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Value *</label>
                  <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Min Order (₹)</label>
                  <input type="number" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Max Uses</label>
                  <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Expires At</label>
                  <input type="datetime-local" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <Button className="w-full" onClick={save} isLoading={saving}>Create Coupon</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
