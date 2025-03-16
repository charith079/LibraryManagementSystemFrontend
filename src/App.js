// Core imports
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context imports
import { AuthProvider, useAuth } from './Components/AuthContext';

// Component imports
import NavBar from './MajorComponents/NavBar';
import PrivateRoute from './Components/PrivateRoute';

// Page imports
import Login from './Pages/LoginPage';
import Signup from './Pages/SignupPage';
import Search from './Pages/SearchPage';
import Favourites from './Pages/FavaouritesPage';
import ProfilePage from './Pages/ProfilePage';
import BooksInHand from './Pages/BooksInHand';
import RequestedBooks from './Pages/RequestedBooksPage';
import SubmittedBooks from './Pages/SubmittedBooks';
import BooksPage from './Pages/BooksPage';

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Handle route persistence
    if (isAuthenticated) {
      const currentPath = window.location.pathname;
      const lastRoute = localStorage.getItem('lastRoute');
      
      // Update route based on conditions
      if (currentPath === '/login' || currentPath === '/signup') {
        window.history.replaceState(null, '', '/books');
      } else if (!lastRoute || lastRoute === '/login' || lastRoute === '/signup') {
        window.history.replaceState(null, '', '/books');
      } else {
        window.history.replaceState(null, '', lastRoute);
      }
    }

    // Save route before unload
    const saveRoute = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.setItem('lastRoute', currentPath);
      }
    };
    window.addEventListener('beforeunload', saveRoute);
    return () => window.removeEventListener('beforeunload', saveRoute);
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AuthWrapper>
        <NavBar />
      </AuthWrapper>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/books" : "/login"} replace />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/books" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/books" replace /> : <Signup />} />

        {/* Protected Routes */}
        <Route path="/books" element={<PrivateRoute element={<BooksPage />} />} />
        <Route path="/search" element={<PrivateRoute element={<Search />} />} />
        <Route path="/favourites" element={<PrivateRoute element={<Favourites />} />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
        <Route path="/books-in-hand" element={<PrivateRoute element={<BooksInHand />} />} />
        <Route path="/requested-books" element={<PrivateRoute element={<RequestedBooks />} />} />
        <Route path="/submitted-books" element={<PrivateRoute element={<SubmittedBooks />} />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/books" : "/login"} replace />} />
      </Routes>
    </div>
  );
};

// Wrapper to display NavBar only when authenticated
const AuthWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : null;
};

// Wrap the entire App component with AuthProvider
const RootApp = () => {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
};

export default RootApp;
