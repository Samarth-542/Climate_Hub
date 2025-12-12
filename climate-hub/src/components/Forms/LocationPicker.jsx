import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';

import L from 'leaflet';

// Aesthetic Custom Icon
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 100%; height: 100%; background-color: #10b981; opacity: 0.5; border-radius: 50%; animation: pulse 2s infinite;"></div>
      <div style="position: relative; width: 12px; height: 12px; background-color: #10b981; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px #10b981;"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
     if (position) {
         map.flyTo(position, map.getZoom());
     }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon}></Marker>
  );
}

export default function LocationPicker({ position, setPosition, onLocationFound, initialCenter = [20, 78], selectedState, selectedDistrict }) {
  // Component to handle View Updates
  function MapViewUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.flyTo(center, zoom);
      }
    }, [center, zoom, map]);
    return null;
  }

  const [viewCenter, setViewCenter] = useState(null);
  const [viewZoom, setViewZoom] = useState(4); // Start with India view

  // Handle auto-zoom when State/District changes
  useEffect(() => {
    if (selectedDistrict && selectedState) {
        const query = `${selectedDistrict}, ${selectedState}`;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    setViewCenter([parseFloat(lat), parseFloat(lon)]);
                    setViewZoom(12); // Zoom in closer for district
                }
            })
            .catch(err => console.error("Geocoding failed for zoom", err));
    } else if (selectedState) {
        // Zoom to state if only state is selected
         fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selectedState)}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    setViewCenter([parseFloat(lat), parseFloat(lon)]);
                    setViewZoom(7); // State level zoom
                }
            })
            .catch(err => console.error("Geocoding failed for zoom", err));
    }
  }, [selectedState, selectedDistrict]);

  // Try to get geolocation on mount
  const handleLocateMe = () => {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition((pos) => {
             const { latitude, longitude } = pos.coords;
             setPosition({ lat: latitude, lng: longitude });
             setViewCenter([latitude, longitude]);
             setViewZoom(15);
             if (onLocationFound) onLocationFound(latitude, longitude);
         });
     }
  };

  return (
    <div className="relative h-64 w-full rounded-xl overflow-hidden border border-[#222] shadow-inner group-hover:border-emerald-500/30 transition-colors">
      <MapContainer 
        center={initialCenter} 
        zoom={4} 
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        className="h-full w-full bg-[#0a0a0a]"
      >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="hue-rotate-180 invert brightness-90 saturate-50"
            noWrap={true}
        />
        <LocationMarker position={position} setPosition={setPosition} />
        <MapViewUpdater center={viewCenter} zoom={viewZoom} />
      </MapContainer>
      <button 
        type="button"
        onClick={handleLocateMe}
        className="absolute bottom-3 right-3 z-[400] bg-[#111] text-emerald-400 border border-[#333] p-2 px-3 rounded-lg shadow-lg text-xs font-bold hover:bg-[#1a1a1a] hover:text-emerald-300 transition-all flex items-center gap-2"
      >
        <span>📍 Locate Me</span>
      </button>
    </div>
  );
}
