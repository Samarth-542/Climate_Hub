import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Clock, Phone, User, CheckCircle, Trash2, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

export default function AdminIncidentCard({ incident, onResolve, onDelete }) {
  const isResolved = incident.status === 'Resolved';

  return (
    <div className={clsx("bg-white text-slate-900 rounded-xl overflow-hidden shadow-sm border", isResolved ? "border-green-200 bg-green-50" : "border-slate-200")}>
      <div className="flex h-full">
        {/* Mini Map Preview */}
        <div className="w-48 h-full flex-none relative bg-slate-100 hidden sm:block">
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
                        'bg-red-100 text-red-700': incident.severity === 'Critical',
                        'bg-orange-100 text-orange-700': incident.severity === 'High',
                        'bg-yellow-100 text-yellow-700': incident.severity === 'Medium',
                        'bg-green-100 text-green-700': incident.severity === 'Low',
                     })}>
                        {incident.severity} {incident.type}
                     </span>
                     <h3 className="text-lg font-bold mt-2 line-clamp-1">{incident.description}</h3>
                </div>
                {isResolved && (
                    <span className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded-full">
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

            {incident.photo && (
                <div className="h-24 w-32 rounded bg-slate-100 overflow-hidden border">
                    <img src={incident.photo} className="h-full w-full object-cover" alt="Evidence" />
                </div>
            )}

            <div className="mt-auto pt-3 border-t flex gap-2 justify-end">
                {!isResolved && (
                    <button 
                        onClick={() => onResolve(incident.id)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded hover:bg-emerald-700 transition"
                    >
                        <CheckCircle size={16} /> Mark Resolved
                    </button>
                )}
                <button 
                    onClick={() => onDelete(incident.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-red-600 text-sm font-medium rounded hover:bg-red-50 transition border border-red-100"
                >
                    <Trash2 size={16} /> Delete
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
