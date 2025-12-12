import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldCheck, Lock, User } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '../components/UI/ToastContext';
import LightRays from '../components/ui/LightRays';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await loginAdmin(username, password);
        addToast("Welcome, Administrator", "success");
        navigate('/admin/dashboard');
    } catch (err) {
        addToast(err.message || "Login Failed", "error");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <LightRays
            raysOrigin="top-center"
            raysColor="#10b981"
            raysSpeed={1.2}
            lightSpread={0.9}
            rayLength={1.3}
            className="opacity-30"
          />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#050505]/70 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_-10px_rgba(16,185,129,0.2)] border border-emerald-500/20 overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          
          {/* Header Section */}
          <div className="relative bg-gradient-to-b from-[#0a0a0a]/90 to-transparent p-8 text-center border-b border-emerald-500/10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                <ShieldCheck size={56} className="relative mx-auto text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
              </div>
              <h1 className="text-3xl font-bold text-white mt-4 tracking-tight">Admin Portal</h1>
              <p className="text-gray-400 mt-2 text-sm">Restricted Access • Authorized Personnel Only</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="relative p-8 space-y-6">
              {/* Username Field */}
              <div>
                  <label className="block text-sm font-bold text-emerald-100 mb-2 tracking-wide">Username</label>
                  <div className="relative group">
                      <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                      <input 
                          type="text"
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a]/60 backdrop-blur-sm border border-white/10 rounded-xl text-gray-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none placeholder:text-gray-600 transition-all shadow-inner"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          placeholder="Enter admin username"
                      />
                  </div>
              </div>
              
              {/* Password Field */}
              <div>
                  <label className="block text-sm font-bold text-emerald-100 mb-2 tracking-wide">Password</label>
                  <div className="relative group">
                      <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                      <input 
                          type="password"
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a]/60 backdrop-blur-sm border border-white/10 rounded-xl text-gray-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none placeholder:text-gray-600 transition-all shadow-inner"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                      />
                  </div>
              </div>

              {/* Submit Button */}
              <button 
                  type="submit"
                  disabled={loading}
                  className={clsx(
                      "relative w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/40 hover:scale-[1.02] overflow-hidden group",
                      loading && "opacity-70 cursor-not-allowed scale-100"
                  )}
              >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Authenticating...
                        </>
                    ) : (
                        <>
                          <ShieldCheck size={20} />
                          Access Dashboard
                        </>
                    )}
                  </span>
              </button>
          </form>
        </div>
      </div>
    </div>
  );
}
