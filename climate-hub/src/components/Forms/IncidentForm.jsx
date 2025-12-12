import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../UI/ToastContext';
import LocationPicker from './LocationPicker';
import { incidentStore } from '../../services/incidentStore';
import { ArrowLeft, Send, Camera } from 'lucide-react';
import clsx from 'clsx';

export default function IncidentForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Flood',
    description: '',
    photo: '',
  });
  const [location, setLocation] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) {
        addToast("Please select a location on the map.", "error");
        return;
    }
    if (!formData.description) {
        addToast("Please provide a description.", "error");
        return;
    }

    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
        incidentStore.add({
            ...formData,
            lat: location.lat,
            lng: location.lng
        });
        setLoading(false);
        addToast("Incident reported successfully!");
        navigate('/');
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition">
        <ArrowLeft size={18} className="mr-1" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Report Climate Incident</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Type */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Incident Type</label>
                <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                >
                    <option value="Flood">Flood</option>
                    <option value="Drought">Drought</option>
                    <option value="Heatwave">Heatwave</option>
                    <option value="Wildfire">Wildfire</option>
                    <option value="Air Quality">Air Quality</option>
                    <option value="Storm">Storm</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none"
                    placeholder="Describe the incident (location details, severity, etc.)"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location (Tap to select)</label>
                <LocationPicker position={location} setPosition={setLocation} />
                {location && (
                    <p className="text-xs text-emerald-600 mt-2 font-medium">
                        Location selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                )}
            </div>

            {/* Photo Upload */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Photo Evidence</label>
                
                <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer group">
                        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg group-hover:border-emerald-500 group-hover:bg-emerald-50 transition">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-2" />
                                <p className="text-sm text-slate-500 group-hover:text-emerald-600">Click to upload image</p>
                            </div>
                        </div>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setFormData(prev => ({ ...prev, photo: reader.result }));
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </label>

                    {formData.photo && (
                        <div className="relative w-32 h-32 flex-none">
                            <img 
                                src={formData.photo} 
                                alt="Preview" 
                                className="w-full h-full object-cover rounded-lg shadow-md border border-slate-200"
                            />
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className={clsx(
                    "w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/30",
                    loading ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01]"
                )}
            >
                {loading ? "Submitting..." : (
                    <>
                        <Send size={20} /> Submit Report
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  );
}
