import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import ClimateMap from "../components/Map/ClimateMap";
import FilterBar from "../components/Dashboard/FilterBar";
import LiveFeed from "../components/Dashboard/LiveFeed";
import { useIncidents } from "../context/IncidentContext";

export default function Dashboard() {
  const { filteredIncidents, filters, setFilters } = useIncidents();
  const [mapFocus, setMapFocus] = useState(null);

  const handleViewOnMap = (incident) => {
    setMapFocus(incident);
  };

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      
      {/* Center Panel (Map) - Grows to fill available space */}
      <div className="flex-1 relative h-full">
         <div className="z-[500] pointer-events-none absolute inset-0">
            <FilterBar filters={filters} setFilters={setFilters} />
         </div>
         <ClimateMap incidents={filteredIncidents} focusIncident={mapFocus} />

        {/* Floating Report Button */}
        <Link
            to="/report"
            className="absolute bottom-6 right-6 z-[600] bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full shadow-lg shadow-emerald-900/40 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center border border-emerald-400/20"
        >
            <Plus size={32} />
        </Link>
      </div>

      {/* Right Panel (Live Feed) - Fixed width */}
      <LiveFeed onViewOnMap={handleViewOnMap} />

    </div>
  );
}
