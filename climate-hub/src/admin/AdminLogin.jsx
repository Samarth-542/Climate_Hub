import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldCheck, Lock, User } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '../components/UI/ToastContext';

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
        <div className="bg-slate-950 p-8 text-center text-white border-b border-slate-800">
            <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-4" />
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-slate-400">Restricted Access only</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Username</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input 
                        type="text"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-600 focus:border-emerald-500 transition-colors"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="admin"
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input 
                        type="password"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-600 focus:border-emerald-500 transition-colors"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className={clsx(
                    "w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/20",
                    loading && "opacity-70 cursor-not-allowed"
                )}
            >
                {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>
        </form>
      </div>
    </div>
  );
}
