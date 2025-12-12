import React from 'react';
import { Search, X } from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';

export default function SearchBar() {
  const { filters, setFilters } = useIncidents();
  
  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, search: '' }));
  };

  return (
    <div className="relative group w-full max-w-md mx-auto">
      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      <div className="relative flex items-center bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-3 shadow-lg focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all duration-300">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
        <input
            type="text"
            placeholder="Search incidents, locations, or types..."
            className="w-full bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 px-3 font-medium text-sm"
            value={filters.search || ''}
            onChange={handleSearch}
        />
        {filters.search && (
            <button 
                onClick={clearSearch}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
                <X size={16} />
            </button>
        )}
      </div>
    </div>
  );
}
