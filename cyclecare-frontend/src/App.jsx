import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage       from './pages/LandingPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import ProfileSetupPage  from './pages/ProfileSetupPage';
import DashboardPage     from './pages/DashboardPage';
import TrackerPage       from './pages/TrackerPage';
import PredictionPage    from './pages/PredictionPage';
import HistoryPage       from './pages/HistoryPage';
import HydrationPage     from './pages/HydrationPage';
import ProfilePage       from './pages/ProfilePage';
import SettingsPage      from './pages/SettingsPage';

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            className: '',
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #1f2937)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' }, duration: 3000 },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' }, duration: 4000 },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route path="/setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/tracker"   element={<ProtectedRoute><TrackerPage /></ProtectedRoute>} />
          <Route path="/prediction" element={<ProtectedRoute><PredictionPage /></ProtectedRoute>} />
          <Route path="/history"   element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/hydration" element={<ProtectedRoute><HydrationPage /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings"  element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
