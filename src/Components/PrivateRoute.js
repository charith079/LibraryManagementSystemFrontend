import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Save the current route for future reloads
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('lastRoute', location.pathname);
    }
  }, [isAuthenticated, location]);

  return isAuthenticated ? element : <Navigate to="/" state={{ from: location }} replace />;
};

export default PrivateRoute;
