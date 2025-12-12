import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

// Helper component to handle map interactions
function MapController({ focusIncident }) {
  const map = useMap();

  useEffect(() => {
    if (focusIncident) {
      map.flyTo([focusIncident.lat, focusIncident.lng], 10, {
        animate: true,
        duration: 1.5
      });
    }
  }, [focusIncident, map]);

  return null;
}

// Remove default icon configuration as we are using custom divIcons
// delete L.Icon.Default.prototype._getIconUrl;

const getMarkerIcon = (severity) => {
  const colors = {
    Critical: "#ef4444",   // red-500
    High: "#f97316",       // orange-500
    Medium: "#eab308",     // yellow-500
    Low: "#22c55e",        // green-500
    Other: "#64748b",      // slate-500
  };

  const color = colors[severity] || colors.Other;

  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex items-center justify-center w-8 h-8">
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

export default function ClimateMap({ incidents, focusIncident }) {
  return (
    <div className="absolute inset-0 h-full w-full">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        className="w-full h-full bg-slate-900"
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
        />

        <MapController focusIncident={focusIncident} />

        {incidents.map((i) => (
          <Marker key={i.id} position={[i.lat, i.lng]} icon={getMarkerIcon(i.severity)}>
            <Popup className="min-w-[200px] leaflet-dark-popup">
              <div className="flex flex-col gap-2 p-1">
                <div className="flex justify-between items-center">
                    <strong className="text-sm font-bold text-slate-900">{i.type}</strong>
                    <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(i.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
                {i.photo && (
                  <img 
                    src={i.photo} 
                    alt="Incident" 
                    className="w-full h-24 object-cover rounded-md border border-slate-200"
                  />
                )}
                <p className="text-xs text-slate-600 !m-0 line-clamp-3 leading-snug">{i.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
