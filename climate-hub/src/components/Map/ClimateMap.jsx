import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";

// Remove default icon configuration as we are using custom divIcons
// delete L.Icon.Default.prototype._getIconUrl;

const getMarkerIcon = (type) => {
  const colors = {
    Flood: "#3b82f6",     // blue-500
    Drought: "#eab308",   // yellow-500
    Heatwave: "#ef4444",  // red-500
    Wildfire: "#f97316",  // orange-500
    "Air Quality": "#a855f7", // purple-500
    Storm: "#6366f1",     // indigo-500
    Other: "#64748b",     // slate-500
  };

  const color = colors[type] || colors.Other;

  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex items-center justify-center w-8 h-8 -ml-4 -mt-8">
       {/* SVG Pin */}
       <svg 
         xmlns="http://www.w3.org/2000/svg" 
         viewBox="0 0 24 24" 
         fill={color} 
         stroke="white" 
         strokeWidth="2" 
         strokeLinecap="round" 
         strokeLinejoin="round" 
         className="w-8 h-8 drop-shadow-md filter"
         style={{ filter: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.15))" }}
       >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" fill="white" />
       </svg>
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: "bg-transparent border-none", // Remove default divIcon validation box
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function ClimateMap({ incidents }) {
  return (
    <div className="absolute inset-0 h-full w-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="w-full h-full"
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {incidents.map((i) => (
          <Marker key={i.id} position={[i.lat, i.lng]} icon={getMarkerIcon(i.type)}>
            <Popup className="min-w-[200px]">
              <div className="flex flex-col gap-2">
                <strong className="text-sm font-bold text-emerald-800">{i.type}</strong>
                {i.photo && (
                  <img 
                    src={i.photo} 
                    alt="Incident" 
                    className="w-full h-32 object-cover rounded-md border border-slate-200"
                  />
                )}
                <p className="text-xs text-slate-600 !m-0 line-clamp-3">{i.description}</p>
                <div className="text-[10px] text-slate-400 mt-1">
                  {new Date(i.timestamp).toLocaleString()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
