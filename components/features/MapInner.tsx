"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon
const agentIcon = L.divIcon({
  html: `<div style="background:#10B981;width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:18px;">🏍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: "",
});

const homeIcon = L.divIcon({
  html: `<div style="background:#22C55E;width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:18px;">🏠</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  className: "",
});

interface MapInnerProps {
  agentLat?: number | null;
  agentLng?: number | null;
  deliveryLat?: number | null;
  deliveryLng?: number | null;
}

export default function MapInner({ agentLat, agentLng, deliveryLat, deliveryLng }: MapInnerProps) {
  const centerLat = agentLat || deliveryLat || 19.076;
  const centerLng = agentLng || deliveryLng || 72.877;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {agentLat && agentLng && (
        <Marker position={[agentLat, agentLng]} icon={agentIcon}>
          <Popup>Delivery Agent</Popup>
        </Marker>
      )}
      {deliveryLat && deliveryLng && (
        <Marker position={[deliveryLat, deliveryLng]} icon={homeIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
