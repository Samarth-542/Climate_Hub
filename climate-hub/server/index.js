require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123';

// Security & Parsing
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// --- DATA STORE (In-Memory for MVP) ---
// Admin User (Seed)
const ADMIN_USER = {
  username: 'admin',
  passwordHash: bcrypt.hashSync(ADMIN_SECRET, 10), // Hash on startup
  role: 'admin',
  district: 'Delhi'
};

// Incidents
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

// --- MIDDLEWARE ---
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

// --- AUTH ROUTES ---

// Admin Login
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  // Simple check
  if (username === ADMIN_USER.username) {
    const isMatch = await bcrypt.compare(password, ADMIN_USER.passwordHash);
    if (isMatch) {
      const token = jwt.sign(
        { username, role: 'admin', district: ADMIN_USER.district },
        JWT_SECRET,
        { expiresIn: '12h' }
      );
      return res.json({ message: "Welcome Admin", token });
    }
  }

  return res.status(401).json({ error: "Invalid credentials" });
});


// --- PUBLIC INCIDENT ROUTES ---

// Get All Incidents (Public Read)
app.get('/incidents', (req, res) => {
  res.json(incidents);
});

// Report Incident (Public Write)
app.post('/incidents', (req, res) => {
  const { type, severity, description, lat, lng, photo, reportedBy, phone } = req.body;

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
    reportedBy: reportedBy || 'Anonymous',
    phone: phone || 'N/A',
    status: 'Open',
    timestamp: new Date().toISOString()
  };

  incidents.unshift(newIncident); // Add to top
  console.log(`[New Incident] ${type} at ${lat},${lng}`);
  res.status(201).json(newIncident);
});

// --- ADMIN ROUTES ---

// Resolve Incident
app.put('/admin/incidents/:id/resolve', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const idx = incidents.findIndex(i => i.id === id);

  if (idx === -1) return res.status(404).json({ error: "Incident not found" });

  incidents[idx].status = 'Resolved';
  res.json({ message: "Incident resolved", incident: incidents[idx] });
});

// Delete Incident
app.delete('/admin/incidents/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const initialLen = incidents.length;
  incidents = incidents.filter(i => i.id !== id);

  if (incidents.length === initialLen) {
    return res.status(404).json({ error: "Incident not found" });
  }

  res.json({ message: "Incident deleted" });
});

// --- EXISTING OTP ROUTES (Kept for compatibility) ---
// ... (Previous OTP logic can remain or be simplified as needed)


app.listen(PORT, () => {
  console.log(`ClimateHub Backend running on port ${PORT}`);
});
