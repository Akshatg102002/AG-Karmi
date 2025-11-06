import React from 'react';
// FIX: Updated react-router-dom imports for v6+ compatibility.
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: User['role'][];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // FIX: Replaced Redirect with Navigate for v6+.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect users to their respective dashboards if they access a page they are not supposed to.
      let redirectPath = '/';
      if (user.role === 'admin') redirectPath = '/admin';
      if (user.role === 'employee') redirectPath = '/dashboard';
      
      // FIX: Replaced Redirect with Navigate for v6+.
      return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
