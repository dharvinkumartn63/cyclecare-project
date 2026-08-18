import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './ui/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PageLoader text="Loading..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
