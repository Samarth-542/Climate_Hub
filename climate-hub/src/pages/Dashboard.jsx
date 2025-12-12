import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import ClimateMap from "../components/Map/ClimateMap";
import FilterBar from "../components/Dashboard/FilterBar";
import { incidentStore } from "../services/incidentStore";
import { isAfter, subHours, subDays, startOfDay } from "date-fns";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({ type: "All", date: "All" });

  useEffect(() => {
    setIncidents(incidentStore.getAll());
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      const itemDate = new Date(item.timestamp);

      if (filters.type !== "All" && item.type !== filters.type) return false;

      if (filters.date === "Today") {
        if (!isAfter(itemDate, startOfDay(new Date()))) return false;
      } else if (filters.date === "24h") {
        if (!isAfter(itemDate, subHours(new Date(), 24))) return false;
      } else if (filters.date === "7d") {
        if (!isAfter(itemDate, subDays(new Date(), 7))) return false;
      }

      return true;
    });
  }, [incidents, filters]);

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden">
      
      {/* Filters */}
      <div className="z-[500] pointer-events-none">
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* Map takes ALL remaining vertical space */}
      <div className="flex-1 min-h-0 w-full h-full">
        <ClimateMap incidents={filteredIncidents} />
      </div>

      {/* Floating button */}
      <Link
        to="/report"
        className="absolute bottom-6 right-6 z-[600] bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <Plus size={32} />
      </Link>
    </div>
  );
}
