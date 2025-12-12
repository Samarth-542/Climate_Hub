import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../UI/ToastContext';
import { useAuth } from '../../context/AuthContext';
import LocationPicker from './LocationPicker';
import { useIncidents } from '../../context/IncidentContext';
import { statesAndDistricts } from '../../data/statesAndDistricts';
import { ArrowLeft, Send, Camera } from 'lucide-react';
import clsx from 'clsx';

export default function IncidentForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { addIncident } = useIncidents();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Flood',
    severity: 'Medium',
    description: '',
    photo: '',
    district: '',
    state: '',
    reportedBy: user?.name || '',
    phone: user?.phone || ''
  });
  const [location, setLocation] = useState(null);

  // Reverse Geocoding Function
  const handleLocationFound = async (lat, lng) => {
      try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await response.json();
          
          if (data && data.address) {
              const address = data.address;
              const detectedState = address.state;
              const detectedDistrict = address.state_district || address.county || address.city_district;

              // Fuzzy match or direct set
              if (detectedState && statesAndDistricts[detectedState]) {
                  setFormData(prev => ({ ...prev, state: detectedState }));
                  
                  // Try to find matching district in our list
                  const validDistricts = statesAndDistricts[detectedState];
                  const match = validDistricts.find(d => 
                      detectedDistrict?.toLowerCase().includes(d.toLowerCase()) || 
                      d.toLowerCase().includes(detectedDistrict?.toLowerCase())
                  );

                  if (match) {
                      setFormData(prev => ({ ...prev, state: detectedState, district: match }));
                      addToast(`Detected: ${match}, ${detectedState}`, "success");
                  } else {
                       addToast(`Detected State: ${detectedState}. Select District manually.`, "info");
                  }
              } else {
                  addToast("Location found, but outside supported area or unknown state.", "warning");
              }
          }
      } catch (error) {
          console.error("Reverse Geocoding Failed", error);
          addToast("Could not auto-detect district from this location.", "error");
      }
  };

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
        addIncident({
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
    <div className="max-w-2xl mx-auto py-4">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-emerald-400 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
      </button>

      <div className="bg-[#050505]/60 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] border border-emerald-500/10 p-6 md:p-10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">Report Incident</h2>
        <p className="text-gray-500 text-sm mb-8">Help us track climate events by providing accurate details.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            <div className="grid grid-cols-2 gap-5">
                {/* Type */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Incident Type</label>
                    <div className="relative">
                        <select 
                            className="w-full p-3 bg-[#111] border border-[#222] text-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none transition-all hover:bg-[#161616]"
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
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Severity */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Severity</label>
                    <div className="relative">
                        <select 
                            className="w-full p-3 bg-[#111] border border-[#222] text-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none transition-all hover:bg-[#161616]"
                            value={formData.severity}
                            onChange={e => setFormData({...formData, severity: e.target.value})}
                        >
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                <textarea 
                    className="w-full p-4 bg-[#111] border border-[#222] text-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none h-32 resize-none placeholder:text-gray-600 transition-all hover:bg-[#161616]"
                    placeholder="Describe the incident details..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
            </div>

            {/* Reporter Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name (Optional)</label>
                   <input 
                        type="text"
                        className="w-full p-3 bg-[#111] border border-[#222] text-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-gray-600 transition-all hover:bg-[#161616]"
                        placeholder="e.g. Alex Smith"
                        value={formData.reportedBy || ''}
                        onChange={e => setFormData({...formData, reportedBy: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number (Optional)</label>
                   <input 
                        type="tel"
                        className="w-full p-3 bg-[#111] border border-[#222] text-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-gray-600 transition-all hover:bg-[#161616]"
                        placeholder="+91..."
                        value={formData.phone || ''}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                   />
                </div>
            </div>

            {/* Location Details (State/District) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                    <div className="relative">
                        <select 
                            className="w-full p-3 bg-[#111] border border-[#222] text-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none transition-all hover:bg-[#161616]"
                            value={formData.state}
                            onChange={e => setFormData({...formData, state: e.target.value, district: ''})}
                        >
                            <option value="">Select State</option>
                            {Object.keys(statesAndDistricts).sort().map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">District</label>
                    <div className="relative">
                        <select 
                            className="w-full p-3 bg-[#111] border border-[#222] text-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:opacity-50 appearance-none transition-all hover:bg-[#161616]"
                            value={formData.district}
                            onChange={e => setFormData({...formData, district: e.target.value})}
                            disabled={!formData.state}
                        >
                            <option value="">Select District</option>
                            {formData.state && statesAndDistricts[formData.state]?.sort().map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Map */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Location (Pin on Map)</label>
                <div className="rounded-xl overflow-hidden border border-[#222]">
                    <LocationPicker 
                        position={location} 
                        setPosition={setLocation} 
                        onLocationFound={handleLocationFound} 
                        selectedState={formData.state}
                        selectedDistrict={formData.district}
                    />
                </div>
                {location && (
                    <p className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                )}
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Photo Evidence</label>
                
                <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer group">
                        <div className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-[#333] rounded-xl group-hover:border-emerald-500/50 group-hover:bg-[#111] transition-all duration-300">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                     <Camera className="w-5 h-5 text-gray-400 group-hover:text-emerald-400" />
                                </div>
                                <p className="text-xs text-gray-500 group-hover:text-emerald-400 font-medium">Click to upload photo</p>
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
                        <div className="relative w-32 h-32 flex-none group">
                            <img 
                                src={formData.photo} 
                                alt="Preview" 
                                className="w-full h-full object-cover rounded-xl shadow-lg border border-[#333]"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg p-1.5 shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className={clsx(
                    "w-full py-4 rounded-xl text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]",
                    loading ? "bg-[#1a1a1a] cursor-not-allowed text-gray-500" : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)] active:scale-[0.98]"
                )}
            >
                {loading ? "Submitting..." : (
                    <>
                        <Send size={18} /> SUBMIT REPORT
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  );
}
