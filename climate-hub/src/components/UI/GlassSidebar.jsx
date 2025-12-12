import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, BarChart3, User, LogOut, Gamepad2 } from 'lucide-react';
import clsx from 'clsx';

// Sidebar Component with Premium Black/Green Design
export default function GlassSidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Main", isHeader: true },
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/report", label: "Report Incident", icon: FileText },
    { path: "/summary", label: "AI Insights", icon: BarChart3 },
    { path: "/games", label: "Games", icon: Gamepad2 },
  ];

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col z-20 bg-[#050505] border-r border-[#1a1a1a] text-gray-300">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]">
                     <svg className="w-5 h-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                </div>
                <span className="text-lg font-bold text-white tracking-tight">ClimateHub</span>
            </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item, index) => {
                if (item.isHeader) {
                    return (
                        <div key={index} className="px-3 pt-5 pb-2">
                             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
                        </div>
                    );
                }

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "group flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
                            isActive 
                                ? "bg-emerald-500/10 text-emerald-400" 
                                : "text-gray-400 hover:bg-[#111] hover:text-gray-200"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={clsx("transition-colors", isActive ? "text-emerald-500" : "text-gray-500 group-hover:text-gray-300")} />
                                    <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="bg-[#1a1a1a] text-gray-400 text-xs py-0.5 px-2 rounded-full border border-[#2a2a2a] group-hover:border-[#333]">
                                        {item.badge}
                                    </span>
                                )}
                                {item.badgeElement && item.badgeElement}
                            </>
                        )}
                    </NavLink>
                );
            })}
        </nav>

        {/* Footer / User Profile Section */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#0a0a0a]">
            {user ? (
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#111] transition-colors cursor-pointer group">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-900 to-emerald-700 flex items-center justify-center text-emerald-100 font-semibold border border-[#222]">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email || 'user@climatehub.com'}</p>
                    </div>
                    <button onClick={logout} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded transition-colors" title="Logout">
                         <LogOut size={16} />
                    </button>
                </div>
            ) : (
                <div className="bg-[#111] rounded-lg p-4 border border-[#222]">
                    <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                             <User size={16} className="text-gray-400" />
                         </div>
                         <div>
                             <p className="text-sm font-medium text-gray-200">Guest User</p>
                             <p className="text-xs text-gray-500">View only access</p>
                         </div>
                    </div>
                    <NavLink to="/admin/login" className="flex items-center justify-center w-full py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-all shadow-[0_0_15px_-4px_rgba(16,185,129,0.4)]">
                        Sign In as Admin
                    </NavLink>
                </div>
            )}
        </div>
    </aside>
  );
}
