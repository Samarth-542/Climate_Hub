import React, { createContext, useContext, useState, useEffect } from 'react';
import { incidentStore } from '../services/incidentStore';
import { isAfter, subHours, subDays, startOfDay } from 'date-fns';

const IncidentContext = createContext();

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({ type: 'All', date: 'All' });
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    incidentStore.seed();
    const data = incidentStore.getAll();
    setIncidents(data);
    setLoading(false);
  }, []);

  const addIncident = (newIncident) => {
    const saved = incidentStore.add(newIncident);
    setIncidents((prev) => [saved, ...prev]);
    return saved;
  };

  const deleteIncident = (id) => {
    incidentStore.remove(id);
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  const filteredIncidents = incidents.filter((item) => {
    const itemDate = new Date(item.timestamp);

    if (filters.type !== 'All' && item.type !== filters.type) return false;

    if (filters.date === 'Today') {
      if (!isAfter(itemDate, startOfDay(new Date()))) return false;
    } else if (filters.date === '24h') {
      if (!isAfter(itemDate, subHours(new Date(), 24))) return false;
    } else if (filters.date === '7d') {
      if (!isAfter(itemDate, subDays(new Date(), 7))) return false;
    }

    return true;
  });

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        filteredIncidents,
        addIncident,
        deleteIncident,
        filters,
        setFilters,
        loading,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidents() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
}
