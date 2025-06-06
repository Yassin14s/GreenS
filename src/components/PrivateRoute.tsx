import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (!auth?.currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}