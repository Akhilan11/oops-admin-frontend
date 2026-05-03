import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-5 h-5 border-2 border-warmblack/20 border-t-warmblack rounded-full animate-spin" /></div>;
  if (!admin?.loggedIn) return <Navigate to="/login" replace />;
  return children;
}
