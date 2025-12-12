import React from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

export default function LiveFeed({ onViewOnMap }) {
  const { filteredIncidents } = useIncidents();

  const getTypeColor = (type) => {
    switch (type) {
      case 'Flood': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Heatwave': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Drought': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Wildfire': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Storm': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="w-80 md:w-96 flex-none bg-slate-900 border-l border-slate-800 flex flex-col h-full z-10 shadow-xl">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
        <h2 className="font-bold text-slate-100 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Live Reports
        </h2>
        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
          {filteredIncidents.length} total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <p>No incidents found.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div 
              key={incident.id} 
              className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={clsx("text-xs px-2 py-1 rounded-full border font-medium", getTypeColor(incident.type))}>
                  {incident.type}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock size={10} />
                  {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                </span>
              </div>
              
              <p className="text-sm text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                {incident.description}
              </p>

              {incident.photo && (
                 <div className="mb-3 rounded-lg overflow-hidden h-24 border border-slate-700/50">
                    <img src={incident.photo} alt="Evidence" className="w-full h-full object-cover" />
                 </div>
              )}

              <button 
                onClick={() => onViewOnMap(incident)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors group-hover:text-emerald-400"
              >
                <MapPin size={12} />
                View Location
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
