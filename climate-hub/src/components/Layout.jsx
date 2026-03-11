import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ToastProvider } from "./UI/ToastContext";

import SearchBar from "./Dashboard/SearchBar";

export default function Layout() {
  return (
    <ToastProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
        <Sidebar />
        
        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 relative flex flex-col overflow-hidden">
          {/* Global Top Navbar */}
          <header className="relative z-30 bg-[#050505] border-b border-[#1a1a1a] py-3 px-6 shadow-sm">
            <div className="flex items-center justify-center w-full">
               <div className="w-full max-w-xl">
                  <SearchBar />
               </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
