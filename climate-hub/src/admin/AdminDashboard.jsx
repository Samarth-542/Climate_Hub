import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../components/UI/ToastContext';
import AdminIncidentCard from './AdminIncidentCard';
import { LogOut, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
  const { logoutAdmin, adminToken } = useAdminAuth();
  const { addToast } = useToast();
  
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
        const res = await fetch('http://localhost:3000/incidents');
        const data = await res.json();
        setIncidents(data);
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-emerald-600 p-2 rounded-lg">
                    <LayoutDashboard size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <p className="text-xs text-slate-400">Delhi District • ClimateHub</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={fetchIncidents} 
                    className="p-2 hover:bg-slate-800 rounded-full transition" 
                    title="Refresh"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
                <div className="h-8 w-px bg-slate-700"></div>
                <button 
                    onClick={logoutAdmin}
                    className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition"
                >
                   <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
         <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Reported Incidents ({incidents.length})</h2>
                {/* Could add filters here */}
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading data...</div>
            ) : incidents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
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
