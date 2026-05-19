import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-[#1A1A1A] text-white px-4 h-14 flex items-center">
        <span className="font-heading font-bold text-xl text-primary">Watnot</span>
        <span className="text-gray-400 text-sm ml-2">Delivery Agent</span>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
