import React, { useState } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';

export default function FilterBar({ filters, setFilters }) {
  // Local state for pending filters
  const [localFilters, setLocalFilters] = useState({
    type: filters.type,
    date: filters.date
  });

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(prev => ({ ...prev, type: localFilters.type, date: localFilters.date }));
  };

  return (
    <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-none">
       {/* Filters Container */}
       <div className="bg-slate-900/90 backdrop-blur-md shadow-xl rounded-xl p-2 md:p-3 flex flex-row gap-2 items-center pointer-events-auto border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 mr-2 border-r border-slate-700 pr-3">
            <SlidersHorizontal size={18} />
            <span className="text-xs font-bold tracking-wider hidden sm:inline">FILTERS</span>
          </div>

          <select 
            className="bg-slate-800 border-none text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 block p-2 outline-none cursor-pointer hover:bg-slate-700 transition-colors"
            value={localFilters.type}
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
            className="bg-slate-800 border-none text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 block p-2 outline-none cursor-pointer hover:bg-slate-700 transition-colors"
            value={localFilters.date}
            onChange={(e) => handleChange('date', e.target.value)}
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>

          {/* Search Button (Apply Filters) */}
          <button 
             onClick={applyFilters}
             className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center justify-center"
             title="Apply Filters"
          >
             <Search size={18} />
          </button>
       </div>
    </div>
  );
}
