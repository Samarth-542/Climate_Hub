import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Clock, Phone, User, CheckCircle, Trash2, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { ShineBorder } from '../components/ui/ShineBorder';

export default function AdminIncidentCard({ incident, onResolve, onDelete }) {
  const isResolved = incident.status === 'Resolved';

  const getShineBorderColor = () => {
    if (isResolved) return ['#10b981', '#34d399', '#6ee7b7'];
    switch (incident.severity) {
      case 'Critical': return ['#ef4444', '#f87171', '#fca5a5'];
      case 'High': return ['#f97316', '#fb923c', '#fdba74'];
      case 'Medium': return ['#eab308', '#facc15', '#fde047'];
      case 'Low': return ['#10b981', '#34d399', '#6ee7b7'];
      default: return ['#6366f1', '#818cf8', '#a5b4fc'];
    }
  };

  return (
    <ShineBorder
      color={getShineBorderColor()}
      borderRadius={12}
      borderWidth={2}
      duration={10}
      className="w-full min-w-0 p-0 bg-slate-800 dark:bg-slate-800"
    >
      <div className={clsx("text-slate-200 rounded-xl overflow-hidden", isResolved ? "bg-emerald-900/10" : "bg-slate-800")}>
        <div className="flex h-full">
          {/* Mini Map Preview */}
          <div className="w-48 h-full flex-none relative bg-slate-900 hidden sm:block grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition duration-500">
              <MapContainer 
                  center={[incident.lat, incident.lng]} 
                  zoom={13} 
                  zoomControl={false} 
                  dragging={false}
                  scrollWheelZoom={false}
                  className="h-full w-full pointer-events-none"
              >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[incident.lat, incident.lng]} />
              </MapContainer>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                  <div>
                       <span className={clsx("text-xs font-bold px-2 py-1 rounded uppercase tracking-wider", {
                          'bg-red-900/30 text-red-400': incident.severity === 'Critical',
                          'bg-orange-900/30 text-orange-400': incident.severity === 'High',
                          'bg-yellow-900/30 text-yellow-400': incident.severity === 'Medium',
                          'bg-emerald-900/30 text-emerald-400': incident.severity === 'Low',
                       })}>
                          {incident.severity} {incident.type}
                       </span>
                       <h3 className="text-lg font-bold mt-2 line-clamp-1 text-slate-100">{incident.description}</h3>
                  </div>
                  {isResolved && (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-900/50">
                          <CheckCircle size={14} /> Resolved
                      </span>
                  )}
              </div>

              <div className="flex gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                      <User size={14} />
                      {incident.reportedBy || 'Anonymous'}
                  </div>
                  <div className="flex items-center gap-1">
                      <Phone size={14} />
                      {incident.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDistanceToNow(new Date(incident.timestamp))} ago
                  </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-400 font-mono bg-slate-900/50 p-1.5 rounded border border-slate-700/50 w-fit">
                  <MapPin size={12} className="text-emerald-500" />
                  {incident.district ? `${incident.district}, ${incident.state}` : 'Unknown Location'}
                  <span className="text-slate-600">|</span>
                  {incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}
              </div>

              {incident.photo && (
                  <div className="h-24 w-32 rounded bg-slate-100 overflow-hidden border">
                      <img src={incident.photo} className="h-full w-full object-cover" alt="Evidence" />
                  </div>
              )}

              <div className="mt-auto pt-3 border-t border-slate-700 flex gap-2 justify-end">
                  {!isResolved && (
                      <button 
                          onClick={() => onResolve(incident.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/20"
                      >
                          <CheckCircle size={16} /> Mark Resolved
                      </button>
                  )}
                  <button 
                      onClick={() => onDelete(incident.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-red-400 text-sm font-medium rounded hover:bg-red-950/30 transition border border-red-900/30 hover:border-red-900/50"
                  >
                      <Trash2 size={16} /> Delete
                  </button>
              </div>
          </div>
        </div>
      </div>
    </ShineBorder>
  );
}
