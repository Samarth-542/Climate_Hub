import React, { useState } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { MapPin, Clock, ArrowRight, SlidersHorizontal, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

export default function LiveFeed({ onViewOnMap, filters, setFilters }) {
  const { filteredIncidents } = useIncidents();
  const [showFilters, setShowFilters] = useState(false);
  
  // Local state for pending filters to avoid constant refetching while selecting
  const [localFilters, setLocalFilters] = useState({
    type: filters?.type || 'All',
    date: filters?.date || 'All'
  });

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(prev => ({ ...prev, type: localFilters.type, date: localFilters.date }));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_10px_-3px_rgba(248,113,113,0.3)]';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20 shadow-[0_0_10px_-3px_rgba(251,146,60,0.3)]';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20 shadow-[0_0_10px_-3px_rgba(250,204,21,0.3)]';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_10px_-3px_rgba(52,211,153,0.3)]';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="w-80 md:w-96 flex-none bg-[#050505] border-l border-[#1a1a1a] flex flex-col h-full z-20 shadow-2xl">
      {/* Filter Section */}
      <div className="p-5 border-b border-[#1a1a1a] bg-gradient-to-b from-[#0a0a0a] to-transparent">
        <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-100 flex items-center gap-3 text-lg tracking-wide">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Live Reports
            </h2>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                {filteredIncidents.length} LIVE
                </span>
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={clsx(
                        "p-2 rounded-lg transition-all duration-200 border",
                        showFilters 
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]" 
                            : "bg-[#111] text-gray-400 border-[#222] hover:text-white hover:border-[#333]"
                    )}
                    title="Toggle Filters"
                >
                    <SlidersHorizontal size={16} />
                </button>
            </div>
        </div>

        {/* Expandable Filter Section */}
        <div className={clsx(
            "overflow-hidden transition-all duration-300 ease-in-out",
            showFilters ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        )}>
            <div className="bg-[#0f0f0f] rounded-xl p-3 border border-[#222] space-y-3 mb-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold ml-1">Type</label>
                        <select 
                            className="w-full bg-[#1a1a1a] border border-[#333] text-gray-300 text-xs rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none transition-colors"
                            value={localFilters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Flood">Flood</option>
                            <option value="Drought">Drought</option>
                            <option value="Heatwave">Heatwave</option>
                            <option value="Wildfire">Wildfire</option>
                            <option value="Air Quality">Air Quality</option>
                            <option value="Storm">Storm</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold ml-1">Time</label>
                        <select 
                            className="w-full bg-[#1a1a1a] border border-[#333] text-gray-300 text-xs rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none transition-colors"
                            value={localFilters.date}
                            onChange={(e) => handleFilterChange('date', e.target.value)}
                        >
                            <option value="All">All Time</option>
                            <option value="Today">Today</option>
                            <option value="24h">24 Hours</option>
                            <option value="7d">7 Days</option>
                        </select>
                    </div>
                </div>
                <button 
                    onClick={applyFilters}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-lg shadow-emerald-900/40 active:scale-95 flex items-center justify-center gap-2"
                >
                    <Search size={14} /> Apply Filters
                </button>
            </div>
        </div>
      </div>

      {/* List Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {filteredIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 space-y-2">
            <Filter size={24} className="opacity-20" />
            <p className="text-sm">No incidents match your filters.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div 
              key={incident.id} 
              className="bg-[#0a0a0a] rounded-xl p-4 border border-[#1a1a1a] hover:border-emerald-500/30 hover:bg-[#0f0f0f] transition-all group duration-300 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={clsx("text-[10px] px-2 py-0.5 rounded-full border font-semibold tracking-wide uppercase", getSeverityColor(incident.severity))}>
                  {incident.type}
                </span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                  <Clock size={10} />
                  {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 line-clamp-2 mb-3 leading-relaxed font-light">
                {incident.description}
              </p>

              {incident.photo && (
                 <div className="mb-3 rounded-lg overflow-hidden h-32 border border-[#222] relative group-hover:border-[#333] transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <img src={incident.photo} alt="Evidence" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 </div>
              )}

              <button 
                onClick={() => onViewOnMap(incident)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#111] hover:bg-[#1a1a1a] text-gray-400 text-xs font-medium transition-all group-hover:text-emerald-400 group-hover:bg-[#1a1a1a] border border-transparent group-hover:border-[#222]"
              >
                <MapPin size={12} />
                <span>View Location</span>
                <ArrowRight size={12} className="-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

