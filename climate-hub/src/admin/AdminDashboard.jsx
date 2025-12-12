import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../components/UI/ToastContext';
import AdminIncidentCard from './AdminIncidentCard';
import { LogOut, RefreshCw, LayoutDashboard } from 'lucide-react';
import { statesAndDistricts } from '../data/statesAndDistricts';

export default function AdminDashboard() {
  const { logoutAdmin, adminToken, adminDistrict } = useAdminAuth();
  const { addToast } = useToast();
  
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-900/40">
                    <LayoutDashboard size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <p className="text-xs text-slate-400">{(adminDistrict && adminDistrict !== 'undefined') ? adminDistrict : 'All'} District • ClimateHub</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={fetchIncidents} 
                    className="p-2 hover:bg-slate-800 rounded-full transition text-slate-300 hover:text-white" 
                    title="Refresh"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
                <div className="h-8 w-px bg-slate-700"></div>
                <button 
                    onClick={logoutAdmin}
                    className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition text-white shadow-lg shadow-red-900/20"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    Reported Incidents 
                    <span className="bg-slate-800 text-slate-300 text-sm px-2 py-1 rounded-full">{incidents.length}</span>
                </h2>
                
                {/* Filters */}
                <div className="flex gap-2 w-full md:w-auto">
                    <select 
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500/50"
                        defaultValue=""
                    >
                        <option value="">All States</option>
                        {Object.keys(statesAndDistricts).sort().map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <select 
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500/50"
                        defaultValue=""
                    >
                         <option value="">All Districts</option>
                         {Object.values(statesAndDistricts).flat().sort().map(d => (
                            <option key={d} value={d}>{d}</option>
                         ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading data...</div>
            ) : incidents.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                    <p className="text-slate-500">No incidents reported yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {incidents.map(incident => (
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
