import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import 'leaflet/dist/leaflet.css';

import { incidentStore } from './services/incidentStore'
import { IncidentProvider } from './context/IncidentContext'

// Initialize dummy data so the map isn't empty on first load
incidentStore.seed();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <IncidentProvider>
          <App />
        </IncidentProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)