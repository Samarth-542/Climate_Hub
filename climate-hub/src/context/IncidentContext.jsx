import React, { createContext, useContext, useState, useEffect } from 'react';
import { incidentStore } from '../services/incidentStore';
import { isAfter, subHours, subDays, startOfDay } from 'date-fns';

const IncidentContext = createContext();

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({ type: 'All', date: 'All' });
  const [loading, setLoading] = useState(true);

  // Load initial data from Backend
  useEffect(() => {
    const fetchIncidents = async () => {
        try {
            const res = await fetch('http://localhost:3000/incidents');
            const data = await res.json();
            setIncidents(data);
        } catch (e) {
            console.error("Failed to load incidents", e);
        } finally {
            setLoading(false);
        }
    };
    fetchIncidents();
  }, []);

  const addIncident = async (newIncident) => {
    try {
        const res = await fetch('http://localhost:3000/incidents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newIncident)
        });
        const saved = await res.json();
        setIncidents((prev) => [saved, ...prev]);
        return saved;
    } catch (e) {
        console.error("Failed to add incident", e);
        throw e;
    }
  };

  const deleteIncident = (id) => {
    // Optimistic update for UI. Reverting handled by refresh on error in real app.
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
