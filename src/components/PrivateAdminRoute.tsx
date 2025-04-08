import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PrivateAdminRoute({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    setIsAdmin(adminAuth === 'true');
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  return children;
}