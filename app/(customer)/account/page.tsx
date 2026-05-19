"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User, MapPin, LogOut, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [addingAddr, setAddingAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", address_line: "", city: "", pincode: "" });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      let activeUser = user;
      if (!user) {
        const savedSession = localStorage.getItem("mock-user-session");
        if (savedSession) {
          activeUser = JSON.parse(savedSession);
        } else {
          router.push("/auth");
          return;
        }
      }
      if (!activeUser) return;
      setUser(activeUser);

      const { data: prof } = await supabase.from("users").select("*").eq("id", activeUser.id).single();
      const activeProf = prof || { id: activeUser.id, full_name: (activeUser as any).full_name || (activeUser as any).user_metadata?.full_name || "Guest User", email: activeUser.email };
      setProfile(activeProf);
      setForm({ full_name: activeProf.full_name || "", email: activeProf.email || "" });

      const { data: addrs } = await supabase.from("addresses").select("*").eq("user_id", activeUser.id);
      setAddresses(addrs || []);
    }
    load();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await (supabase as any).from("users").update({ full_name: form.full_name }).eq("id", user.id);
    if (error) toast.error("Failed to save");
    else { toast.success("Profile updated!"); setEditing(false); setProfile((p: any) => ({ ...p, full_name: form.full_name })); }
    setSaving(false);
  };

  const saveAddress = async () => {
    if (!newAddr.address_line) { toast.error("Please enter your Flat / Tower info"); return; }
    const fullAddressLine = `${newAddr.address_line}, Indiabulls Greens`;
    const { data, error } = await (supabase as any).from("addresses").insert({ 
      label: newAddr.label || "Home", 
      address_line: fullAddressLine, 
      city: "Panvel, Navi Mumbai", 
      pincode: "410206",
      user_id: user?.id || "mock-customer-123"
    }).select().single();
    
    if (error) {
      // High-fidelity fallback for guest/offline testing mode
      const localAddr = {
        id: "local-" + Date.now(),
        label: newAddr.label || "Home",
        address_line: fullAddressLine,
        city: "Panvel, Navi Mumbai",
        pincode: "410206",
        user_id: user?.id || "mock-customer-123"
      };
      setAddresses((p) => [...p, localAddr]);
      setNewAddr({ label: "", address_line: "", city: "", pincode: "" });
      setAddingAddr(false);
      toast.success("Address added locally (Guest Mode)");
      return;
    }
    setAddresses((p) => [...p, data]);
    setNewAddr({ label: "", address_line: "", city: "", pincode: "" });
    setAddingAddr(false);
    toast.success("Address added at Indiabulls Greens, Panvel");
  };

  const deleteAddress = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    setAddresses((p) => p.filter((a) => a.id !== id));
    toast.success("Address removed");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("mock-user-session");
    router.push("/auth");
  };

  if (!profile) {
    return <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-surface rounded-xl h-20 animate-pulse" />)}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Profile */}
      <div className="bg-surface rounded-xl border border-zinc-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold">{profile.full_name || "Your Name"}</h2>
              <p className="text-sm text-text-secondary">{profile.email}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit"}
          </Button>
        </div>

        {editing && (
          <div className="space-y-3 mt-3">
            <Input label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <Button onClick={saveProfile} isLoading={saving}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="bg-surface rounded-xl border border-zinc-800 p-5 space-y-3">
        <Link href="/orders" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors">
          <ShoppingBag className="w-5 h-5 text-text-secondary" /> My Orders
        </Link>
      </div>

      {/* Addresses */}
      <div className="bg-surface rounded-xl border border-zinc-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Saved Addresses</h2>
          <Button size="sm" variant="outline" onClick={() => setAddingAddr(!addingAddr)}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        {addresses.map((addr) => (
          <div key={addr.id} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
            <div>
              <p className="font-medium text-sm">{addr.label || "Home"}</p>
              <p className="text-xs text-text-secondary">{addr.address_line}, {addr.city} – {addr.pincode}</p>
            </div>
            <button onClick={() => deleteAddress(addr.id)} className="text-danger hover:text-red-700 ml-3 mt-0.5">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {addingAddr && (
          <div className="space-y-2 mt-3 p-3 bg-surface rounded-lg">
            <div className="text-xs font-semibold text-primary mb-1">
              📍 Delivering EXCLUSIVELY to Indiabulls Greens, Panvel
            </div>
            <input placeholder="Label (Home / Work)" value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary" />
            <input placeholder="Flat No. & Tower Name (e.g. Tower 4, Flat 1202)" value={newAddr.address_line} onChange={(e) => setNewAddr({ ...newAddr, address_line: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary" />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="City" value="Panvel, Navi Mumbai" disabled className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" />
              <input placeholder="Pincode" value="410206" disabled className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveAddress}>Save Address</Button>
              <Button size="sm" variant="ghost" onClick={() => setAddingAddr(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <Button variant="danger" className="w-full" onClick={logout}>
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
}
