import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ToastProvider } from "./UI/ToastContext";

export default function Layout() {
  return (
    <ToastProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
        <Sidebar />
        
        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 relative flex flex-col overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}
