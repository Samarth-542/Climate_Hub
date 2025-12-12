const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const crypto = require("crypto");

// In-Memory Store (Shared)
let incidents = [];

// --- PUBLIC ROUTES ---

// Get All Incidents
router.get("/incidents", (req, res) => {
  res.json(incidents);
});

// Report Incident
router.post("/incidents", (req, res) => {
  const { type, severity, description, lat, lng, photo, district, state, reportedBy, phone } = req.body;

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
    state: state || 'Unknown',
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
