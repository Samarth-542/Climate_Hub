const STORAGE_KEY = 'climatehub_incidents';

export const incidentStore = {
  getAll: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load incidents", e);
      return [];
    }
  },

  add: (incident) => {
    const current = incidentStore.getAll();
    const newIncident = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...incident
    };
    // Add to beginning of list
    const updated = [newIncident, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newIncident;
  },

  remove: (id) => {
    const current = incidentStore.getAll();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  seed: () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const dummies = [
        {
          id: '1',
          type: 'Flood',
          description: 'Heavy flooding observed near the river bank. Water levels rising rapidly.',
          lat: 51.505,
          lng: -0.09,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
        },
        {
          id: '2',
          type: 'Heatwave',
          description: 'Extreme heat warning in effect. Temperature recorded at 42°C.',
          lat: 48.8566,
          lng: 2.3522,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
        },
        {
          id: '3',
          type: 'Storm',
          description: 'Severe thunderstorm with high winds causing tree damage.',
          lat: 40.7128,
          lng: -74.0060,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() // 20 hours ago
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dummies));
      console.log("Seeded dummy data");
    }
  }
};
