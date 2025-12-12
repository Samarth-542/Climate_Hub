import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Summary from './pages/Summary';
import Login from './pages/Login';
import GameHome from './pages/GameHome';
import QuestionPage from './pages/QuestionPage';
import ScorePage from './pages/ScorePage';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/UI/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />

            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="report" element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              } />
              <Route path="summary" element={<Summary />} />
              <Route path="games" element={<GameHome />} />
              <Route path="games/play" element={<QuestionPage />} />
              <Route path="games/score" element={<ScorePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
