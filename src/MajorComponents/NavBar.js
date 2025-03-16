import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Components/AuthContext';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <div className="text-xl font-bold">
          <Link to="/" className="hover:text-gray-300">Library</Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-4 items-center">

          {/* Conditional rendering based on authentication */}
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/books" className="hover:text-gray-300">Books</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-gray-300">Search</Link>
              </li>
              <li>
                <Link to="/favourites" className="hover:text-gray-300">Favourites</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              </li>
              <li>
                <Link to="/books-in-hand" className="hover:text-gray-300">Books In Hand</Link>
              </li>
              <li>
                <Link to="/requested-books" className="hover:text-gray-300">Requested Books</Link>
              </li>
              <li>
                <Link to="/submitted-books" className="hover:text-gray-300">Submitted Books</Link>
              </li>
              <li>
                <button 
                  onClick={logout} 
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-gray-300">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
