import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';

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
    <Marker position={position}></Marker>
  );
}

export default function LocationPicker({ position, setPosition, initialCenter = [20, 0] }) {
  // Try to get geolocation on mount
  const handleLocateMe = () => {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition((pos) => {
             const { latitude, longitude } = pos.coords;
             setPosition({ lat: latitude, lng: longitude });
         });
     }
  };

  return (
    <div className="relative h-64 w-full rounded-lg overflow-hidden border border-slate-300">
      <MapContainer center={initialCenter} zoom={2} className="h-full w-full">
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <button 
        type="button"
        onClick={handleLocateMe}
        className="absolute bottom-2 right-2 z-[400] bg-white text-slate-700 p-2 rounded shadow text-xs font-bold hover:bg-slate-50"
      >
        Locate Me
      </button>
    </div>
  );
}
