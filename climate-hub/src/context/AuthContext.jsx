import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('climatehub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Step 1: Request OTP (Mock)
  const requestOTP = async (phone) => {
    // In a real app, this would call an API
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[MOCK OTP] for ${phone}: ${mockOtp}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock OTP to component so it can alert the user (since we have no backend)
    return mockOtp;
  };

  // Step 2: Verify OTP
  const verifyOTP = (inputOtp, generatedOtp, userData) => {
    if (inputOtp === generatedOtp) {
        // Success
        const newUser = {
            id: crypto.randomUUID(),
            ...userData,
            verifiedAt: new Date().toISOString()
        };
        setUser(newUser);
        localStorage.setItem('climatehub_user', JSON.stringify(newUser));
        return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('climatehub_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, requestOTP, verifyOTP, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
