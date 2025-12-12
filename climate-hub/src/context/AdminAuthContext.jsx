import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token'));

  const loginAdmin = async (username, password) => {
    try {
      const res = await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setAdminToken(data.token);
      localStorage.setItem('admin_token', data.token);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    localStorage.removeItem('admin_token');
  };

  return (
    <AdminAuthContext.Provider value={{ adminToken, isAdmin: !!adminToken, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
