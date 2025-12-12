const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const crypto = require("crypto");

// In-Memory Store (Shared)
let incidents = [
  {
    id: '1',
    type: 'Flood',
    severity: 'Critical',
    description: 'Heavy flooding observed near the river bank. Water levels rising rapidly.',
    lat: 51.505,
    lng: -0.09,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    reportedBy: 'System',
    phone: 'N/A',
    status: 'Open'
  },
  {
    id: '2',
    type: 'Heatwave',
    severity: 'High',
    description: 'Extreme heat warning in effect. Temperature recorded at 42°C.',
    lat: 48.8566,
    lng: 2.3522,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    reportedBy: 'System',
    phone: 'N/A',
    status: 'Open'
  },
  {
    id: '3',
    type: 'Storm',
    severity: 'Medium',
    description: 'Severe thunderstorm with high winds causing tree damage.',
    lat: 40.7128,
    lng: -74.0060,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    reportedBy: 'System',
    phone: 'N/A',
    status: 'Resolved'
  }
];

// --- PUBLIC ROUTES ---

// Get All Incidents
router.get("/incidents", (req, res) => {
  res.json(incidents);
});

// Report Incident
router.post("/incidents", (req, res) => {
  const { type, severity, description, lat, lng, photo, district, reportedBy, phone } = req.body;

  if (!type || !description || !lat || !lng) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newIncident = {
    id: crypto.randomUUID(),
    type,
    severity: severity || 'Medium',
    description,
    lat,
    lng,
    photo: photo || null,
    district: district || 'Unknown',
    reportedBy: reportedBy || 'Anonymous',
    phone: phone || 'N/A',
    status: 'Open',
    timestamp: new Date().toISOString()
  };

  incidents.unshift(newIncident);
  res.status(201).json(newIncident);
});

// --- ADMIN ROUTES ---

// Get Incidents (Admin View - Filtered by District)
router.get("/admin/incidents", adminAuth, (req, res) => {
  const adminDistrict = req.user.district;

  if (!adminDistrict || adminDistrict === 'All') {
    return res.json(incidents);
  }

  // Filter by district (Case insensitive)
  const filtered = incidents.filter(i =>
    i.district && i.district.toLowerCase() === adminDistrict.toLowerCase()
  );
  res.json(filtered);
});

// Resolve
router.put("/admin/incidents/:id/resolve", adminAuth, (req, res) => {
  const { id } = req.params;
  const idx = incidents.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  // Verify District Scope
  if (req.user.district !== 'All' &&
    incidents[idx].district &&
    incidents[idx].district.toLowerCase() !== req.user.district.toLowerCase()) {
    return res.status(403).json({ error: "Unauthorized for this district" });
  }

  incidents[idx].status = 'Resolved';
  res.json({ message: "Marked resolved", incident: incidents[idx] });
});

// Delete
router.delete("/admin/incidents/:id", adminAuth, (req, res) => {
  const { id } = req.params;
  const initialLen = incidents.length;

  // Check existence and permission first
  const toDelete = incidents.find(i => i.id === id);
  if (!toDelete) return res.status(404).json({ error: "Not found" });

  if (req.user.district !== 'All' &&
    toDelete.district &&
    toDelete.district.toLowerCase() !== req.user.district.toLowerCase()) {
    return res.status(403).json({ error: "Unauthorized for this district" });
  }

  incidents = incidents.filter(i => i.id !== id);
  res.json({ message: "Incident deleted" });
});

module.exports = router;
