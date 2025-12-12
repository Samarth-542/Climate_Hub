import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../components/UI/ToastContext';
import AdminIncidentCard from './AdminIncidentCard';
import { LogOut, RefreshCw, LayoutDashboard } from 'lucide-react';
import { statesAndDistricts } from '../data/statesAndDistricts';
import LightRays from '../components/ui/LightRays';

export default function AdminDashboard() {
  const { logoutAdmin, adminToken, adminDistrict } = useAdminAuth();
  const { addToast } = useToast();
  
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ state: '', district: '' });

  const filteredIncidents = incidents.filter(incident => {
     if (filters.state && filters.state !== '' && incident.state !== filters.state) return false;
     if (filters.district && filters.district !== '' && incident.district !== filters.district) return false;
     return true;
  });

  const fetchIncidents = async () => {
    if (!adminToken) return;
    try {
        const res = await fetch('http://localhost:3000/admin/incidents', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
            const data = await res.json();
            setIncidents(data);
        } else {
             // If 403/401, handle logout?
             if(res.status === 401 || res.status === 403) logoutAdmin();
        }
    } catch (err) {
        addToast("Failed to load incidents", "error");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleResolve = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/admin/incidents/${id}/resolve`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
            addToast("Incident marked as Resolved", "success");
            fetchIncidents(); // Refresh
        } else {
            throw new Error('Failed');
        }
    } catch (e) {
        addToast("Action Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
        const res = await fetch(`http://localhost:3000/admin/incidents/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
            addToast("Record deleted", "success");
            fetchIncidents(); // Refresh
        } else {
            throw new Error('Failed');
        }
    } catch (e) {
        addToast("Delete Failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col text-white relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <LightRays
            raysOrigin="top-center"
            raysColor="#10b981"
            raysSpeed={1.0}
            lightSpread={0.8}
            rayLength={1.2}
            className="opacity-20"
          />
      </div>

      {/* Header */}
      <header className="relative bg-[#050505]/80 backdrop-blur-xl text-white p-4 shadow-2xl sticky top-0 z-50 border-b border-emerald-500/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-900/40">
                    <LayoutDashboard size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-xs text-gray-400">{(adminDistrict && adminDistrict !== 'undefined') ? adminDistrict : 'All'} District • ClimateHub</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={fetchIncidents} 
                    className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-emerald-400" 
                    title="Refresh"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
                <div className="h-8 w-px bg-white/10"></div>
                <button 
                    onClick={logoutAdmin}
                    className="flex items-center gap-2 text-sm bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 px-4 py-2 rounded-lg font-bold transition text-white shadow-lg shadow-red-900/30 hover:scale-105"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative flex-1 p-6 overflow-y-auto z-10">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    Reported Incidents 
                    <span className="bg-emerald-500/20 text-emerald-400 text-sm px-3 py-1 rounded-full border border-emerald-500/30">{incidents.length}</span>
                </h2>
                
            {/* Filters */}
                <div className="flex gap-2 w-full md:w-auto">
                    <select 
                        className="bg-[#0a0a0a]/70 backdrop-blur-sm border border-white/10 text-gray-300 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                        value={filters.state}
                        onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value, district: '' }))}
                    >
                        <option value="">All States</option>
                        {Object.keys(statesAndDistricts).sort().map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <select 
                        className="bg-[#0a0a0a]/70 backdrop-blur-sm border border-white/10 text-gray-300 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 disabled:opacity-50"
                        value={filters.district}
                        onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                        disabled={!filters.state}
                    >
                         <option value="">All Districts</option>
                         {filters.state && statesAndDistricts[filters.state]?.sort().map(d => (
                            <option key={d} value={d}>{d}</option>
                         ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading data...</div>
            ) : filteredIncidents.length === 0 ? (
                <div className="text-center py-20 bg-[#050505]/50 backdrop-blur-sm rounded-xl border border-dashed border-white/10">
                    <p className="text-gray-500">No incidents match the filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredIncidents.map(incident => (
                        <AdminIncidentCard 
                            key={incident.id} 
                            incident={incident} 
                            onResolve={handleResolve}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
         </div>
      </main>
    </div>
  );
}
