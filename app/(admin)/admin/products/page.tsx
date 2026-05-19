"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const emptyProduct = { name: "", description: "", price: "", mrp: "", unit: "", stock_qty: "100", category_id: "", is_available: true, is_featured: false, image_url: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyProduct });
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("display_order"),
    ]);
    setProducts(prods || []);
    setCategories(cats || []);
    setLoading(false);
  }

  const openEdit = (product: any) => {
    setEditing(product);
    setForm({ name: product.name, description: product.description || "", price: product.price, mrp: product.mrp || "", unit: product.unit || "", stock_qty: product.stock_qty, category_id: product.category_id || "", is_available: product.is_available, is_featured: product.is_featured, image_url: product.image_url || "" });
    setShowForm(true);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url || null;
    const ext = imageFile.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, imageFile);
    if (error) { toast.error("Image upload failed"); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const save = async () => {
    if (!form.name || !form.price || !form.category_id) { toast.error("Fill required fields"); return; }
    setSaving(true);

    const image_url = await uploadImage();
    const payload = { name: form.name, description: form.description, price: parseFloat(form.price), mrp: form.mrp ? parseFloat(form.mrp) : null, unit: form.unit, stock_qty: parseInt(form.stock_qty), category_id: form.category_id, is_available: form.is_available, is_featured: form.is_featured, image_url };

    if (editing) {
      const { error } = await (supabase as any).from("products").update(payload).eq("id", editing.id);
      if (error) { toast.error("Failed to update"); } else { toast.success("Product updated!"); }
    } else {
      const { error } = await (supabase as any).from("products").insert(payload);
      if (error) { toast.error("Failed to create"); } else { toast.success("Product created!"); }
    }

    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm({ ...emptyProduct });
    setImageFile(null);
    load();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((p) => p.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Products</h1>
        <Button onClick={() => { setEditing(null); setForm({ ...emptyProduct }); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />) : products.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="relative aspect-square bg-surface">
              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  unoptimized={p.image_url.startsWith("/api/images/product")}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>
              )}
              {!p.is_available && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white text-xs font-bold">UNAVAILABLE</span></div>}
            </div>
            <div className="p-3">
              <p className="font-medium text-sm line-clamp-1">{p.name}</p>
              <p className="text-xs text-text-secondary">{p.categories?.name} · {p.unit}</p>
              <p className="font-bold text-sm mt-1">{formatCurrency(p.price)}</p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 py-1 text-xs border border-gray-200 rounded-lg hover:bg-surface transition-colors">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => deleteProduct(p.id)} className="flex items-center justify-center p-1 text-danger border border-danger/20 rounded-lg hover:bg-danger/5 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-5 border-b border-neutral-800 pb-3">
              <h2 className="font-heading text-xl font-bold text-white">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
 
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1.5 block text-neutral-300">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-primary placeholder-neutral-500" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-neutral-300">Price *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-primary placeholder-neutral-500" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-neutral-300">MRP</label>
                  <input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-primary placeholder-neutral-500" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-neutral-300">Unit</label>
                  <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="500g, 1L, pack…" className="w-full h-10 px-3 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-primary placeholder-neutral-500" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-neutral-300">Stock</label>
                  <input type="number" value={form.stock_qty} onChange={(e) => setForm({ ...form, stock_qty: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-primary placeholder-neutral-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1.5 block text-neutral-300">Category *</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-primary">
                    <option value="" className="bg-neutral-900 text-neutral-400">Select category…</option>
                    {categories.map((c) => <option key={c.id} value={c.id} className="bg-neutral-900 text-white">{c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1.5 block text-neutral-300">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-primary resize-none placeholder-neutral-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1.5 block text-neutral-300">Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-sm w-full text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700" />
                  {form.image_url && !imageFile && <p className="text-xs text-neutral-400 mt-1">Current: image set</p>}
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="available" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="accent-primary w-4 h-4 rounded border-neutral-800 bg-neutral-950" />
                  <label htmlFor="available" className="text-sm text-neutral-300">Available</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-primary w-4 h-4 rounded border-neutral-800 bg-neutral-950" />
                  <label htmlFor="featured" className="text-sm text-neutral-300">Featured</label>
                </div>
              </div>
 
              <Button className="w-full" onClick={save} isLoading={saving}>
                {editing ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
