import React from 'react';
import { SlidersHorizontal, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
            className="bg-slate-800 border-none text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 block p-2 outline-none cursor-pointer hover:bg-slate-700 transition-colors"
            value={filters.date}
            onChange={(e) => handleChange('date', e.target.value)}
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
       </div>
    </div>
  );
}
