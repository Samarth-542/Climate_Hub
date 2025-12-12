import React from 'react';
import { SlidersHorizontal, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="absolute top-20 md:top-4 left-4 right-4 md:right-auto z-[400] flex flex-col gap-2 pointer-events-none">
       {/* Filters Container */}
       <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-xl p-2 md:p-3 flex flex-row gap-2 items-center pointer-events-auto border border-slate-200 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-2 text-slate-500 mr-2">
            <SlidersHorizontal size={18} />
            <span className="text-xs font-semibold hidden sm:inline">FILTERS</span>
          </div>

          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none"
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Flood">Flood</option>
            <option value="Drought">Drought</option>
            <option value="Heatwave">Heatwave</option>
            <option value="Wildfire">Wildfire</option>
            <option value="Air Quality">Air Quality</option>
            <option value="Storm">Storm</option>
            <option value="Other">Other</option>
          </select>

          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none"
            value={filters.date}
            onChange={(e) => handleChange('date', e.target.value)}
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
       </div>

       {/* AI Summary Quick Link (Desktop alternate location, but kept near filters for access) */}
       <Link 
         to="/summary"
         className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 backdrop-blur rounded-xl px-4 py-2 items-center gap-2 pointer-events-auto transition w-fit"
       >
          <BarChart3 size={18} />
          <span className="font-medium text-sm">View AI Insights</span>
       </Link>
    </div>
  );
}
