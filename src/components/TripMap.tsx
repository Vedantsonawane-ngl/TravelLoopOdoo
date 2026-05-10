"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function TripMap({ 
  activities, 
  city 
}: { 
  activities: any[], 
  city: string 
}) {
  // Try to find the first activity with coordinates, otherwise default to [0,0]
  // Note: Since Gemini might not return exact lat/long without a specific prompt, 
  // we could just mock a central location or rely on stops if they have lat/long.
  // For the hackathon prototype, if there are no coordinates, we'll center on a default view.
  
  // Actually, we can use a geocoding service like Nominatim for the city if we want, 
  // but for simplicity, let's just set a default center and add mock pins if needed.
  const center: [number, number] = [35.6762, 139.6503]; // Default Tokyo
  const zoom = 11;

  // Mock markers if activities don't have lat/long for the prototype
  const markers = activities.slice(0, 5).map((act, i) => ({
    id: act.id,
    title: act.title,
    // Add small random offsets to center for demo purposes
    position: [center[0] + (Math.random() - 0.5) * 0.1, center[1] + (Math.random() - 0.5) * 0.1] as [number, number]
  }));

  return (
    <div className="h-[400px] w-full rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Main City Marker */}
        <Marker position={center} icon={icon}>
          <Popup>
            <strong className="text-sm">{city}</strong><br/>
            Central Hub
          </Popup>
        </Marker>

        {/* Activity Markers */}
        {markers.map(marker => (
          <Marker key={marker.id} position={marker.position} icon={icon}>
            <Popup>
              <span className="text-sm font-medium">{marker.title}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
