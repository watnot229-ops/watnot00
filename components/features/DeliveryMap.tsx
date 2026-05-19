"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamic import to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("./MapInner"), { ssr: false });

interface DeliveryMapProps {
  agentLat?: number | null;
  agentLng?: number | null;
  deliveryLat?: number | null;
  deliveryLng?: number | null;
}

export function DeliveryMap(props: DeliveryMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-full h-64 bg-surface rounded-xl flex items-center justify-center text-text-secondary">Loading map…</div>;

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-100">
      <MapWithNoSSR {...props} />
    </div>
  );
}
