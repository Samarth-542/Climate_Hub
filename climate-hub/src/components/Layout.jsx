import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Map, FileText, BarChart3 } from "lucide-react";
import clsx from "clsx";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Map", icon: Map },
    { path: "/report", label: "Report", icon: FileText },
    { path: "/summary", label: "Insights", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">

      {/* HEADER */}
      <header className="flex-none bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
            CH
          </div>
          <h1 className="text-xl font-bold text-emerald-700">ClimateHub</h1>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-h-0 overflow-auto relative">
        <Outlet />
      </main>
    </div>
  );
}
