import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map, FileText, BarChart3, Info, Globe, LogOut, User } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Map },
    { path: "/report", label: "Report Incident", icon: FileText },
    { path: "/summary", label: "AI Insights", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 flex-none bg-slate-900 border-r border-slate-800 flex flex-col text-slate-100">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/50">
          <Globe size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            ClimateHub
          </h1>
          <p className="text-xs text-slate-400">SDG 13 Action</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-emerald-600/10 text-emerald-400 border border-emerald-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {user ? (
            <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-500">
                        <User size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-slate-200">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.phone}</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:bg-red-950/30 py-2 rounded transition-colors"
                >
                    <LogOut size={12} /> Sign Out
                </button>
            </div>
        ) : (
             <div className="bg-slate-800/50 rounded-lg p-4 text-xs text-slate-400">
                <p className="font-semibold text-slate-300 mb-1">Status: Guest</p>
                <p>Login to submit reports.</p>
             </div>
        )}
      </div>
    </aside>
  );
}
