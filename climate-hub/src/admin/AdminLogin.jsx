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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-8 text-center text-white">
            <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-4" />
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-slate-400">Restricted Access only</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text"
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="admin"
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="password"
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
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
                    "w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition shadow-lg",
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
