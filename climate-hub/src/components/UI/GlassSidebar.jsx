import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, BarChart3, User, LogOut, CheckSquare, Layers } from 'lucide-react';
import clsx from 'clsx';

// Sidebar Component with Glassmorphism Design
export default function GlassSidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/report", label: "Report Incident", icon: FileText },
    { path: "/summary", label: "AI Insights", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col z-10 bg-white/5 backdrop-blur-lg border-r border-white/10 text-gray-200">
        <div className="h-20 flex items-center justify-center border-b border-white/10">
            <div className="flex items-center gap-2">
                {/* Logo Icon */}
                <svg className="w-8 h-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="text-xl font-bold text-white">ClimateHub</span>
            </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
            {navItems.map(item => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                        isActive 
                            ? "bg-white/10 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/10" 
                            : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    )}
                >
                    <item.icon size={20} className={clsx("transition-transform", { "text-indigo-400": true })} />
                    <span className="font-medium">{item.label}</span>
                </NavLink>
            ))}
        </nav>

        <div className="p-4 border-t border-white/10">
            {user ? (
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                         <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                {user.name ? user.name.charAt(0).toUpperCase() : <User size={18}/>}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
                         </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-indigo-300 truncate">{user.role || 'Member'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10 py-2 rounded-lg transition-colors"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            ) : (
                 <div className="bg-white/5 rounded-xl p-4 text-xs text-gray-400 border border-white/5">
                    <p className="font-semibold text-gray-300 mb-1">Guest Access</p>
                    <p className="mb-3">Login to access advanced features.</p>
                    <NavLink 
                        to="/admin/login" 
                        className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg transition-colors border border-indigo-500/20"
                    >
                        Admin Login
                    </NavLink>
                 </div>
            )}
        </div>
    </aside>
  );
}
