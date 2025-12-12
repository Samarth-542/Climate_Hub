import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, BarChart3, Search as SearchIcon } from "lucide-react";
import { AdvancedMap } from "../components/ui/InteractiveMap";
import LightRays from "../components/ui/LightRays";
import LiveFeed from "../components/Dashboard/LiveFeed";
import SearchBar from "../components/Dashboard/SearchBar";
import { useIncidents } from "../context/IncidentContext";
import clsx from "clsx";

export default function Dashboard() {
  const { filteredIncidents, filters, setFilters } = useIncidents();
  const [mapFocus, setMapFocus] = useState(null);

  const handleViewOnMap = (incident) => {
    setMapFocus(incident);
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/report", label: "Report", icon: FileText },
    { path: "/summary", label: "AI Insights", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#000000] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <LightRays
             raysOrigin="top-center"
             raysColor="#10b981"
             raysSpeed={1.5}
             lightSpread={0.8}
             rayLength={1.2}
             followMouse={true}
             mouseInfluence={0.1}
             noiseAmount={0.1}
             distortion={0.05}
             className="opacity-30"
          />
      </div>

      {/* Horizontal Top Navbar */}
      <header className="relative z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-emerald-500/10 py-3 px-6">
        <div className="flex items-center justify-center">
          {/* Search Bar - Centered */}
          <div className="w-full max-w-xl mx-auto">
             <SearchBar />
          </div>
        </div>
      </header>

      {/* Main Content: Map + Feed */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Map Panel */}
        <div className="flex-1 relative p-6">
          <div className="h-full w-full rounded-[2rem] overflow-hidden shadow-[0_0_40px_-5px_rgba(16,185,129,0.1)] border border-[#1a1a1a] relative z-10">
             <AdvancedMap 
                 center={[20.5937, 78.9629]}
                 zoom={5}
                 focusLocation={mapFocus ? [mapFocus.lat, mapFocus.lng] : null}
                 markers={filteredIncidents.map(incident => ({
                     id: incident.id,
                     position: [incident.lat, incident.lng],
                     color: incident.severity === 'Critical' ? 'red' : 
                            incident.severity === 'High' ? 'orange' :
                            incident.severity === 'Medium' ? 'yellow' : 'green',
                     size: 'medium',
                     popup: {
                         title: incident.type,
                         content: `${incident.description} (${incident.severity})`,
                         image: incident.photo
                     }
                 }))}
                 enableClustering={true}
                 enableSearch={false}
                 enableControls={true}
                 onMapClick={(latlng) => console.log(latlng)}
             />
          </div>
        </div>

        {/* Live Feed Panel */}
        <LiveFeed 
            onViewOnMap={handleViewOnMap} 
            filters={filters}
            setFilters={setFilters}
        />
      </div>
    </div>
  );
}
