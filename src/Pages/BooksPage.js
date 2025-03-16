import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Components/AuthContext';
// require('dotenv').config();
const Home = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const { user, token, updateUser } = useAuth();
  const baseURL = process.env.REACT_APP_API_KEY;

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`https://librarymanagementsystembackend.onrender.com/api/books`);
      
      if (response.data && Array.isArray(response.data)) {
        setBooks(response.data);
        setError(null);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('API URL:', process.env.REACT_APP_API_URL); // For debugging
      console.error('Fetch error:', err);
      setError('Failed to fetch books. Please try again later.');
      setBooks([]);
    }
  };

  useEffect(() => {
    if (baseURL) {
      fetchBooks();
    } else {
      setError('API configuration missing');
    }
  }, [baseURL]);

  useEffect(() => {
    console.log('Books data:', books);
  }, [books]);

  const toggleFavorite = async (book) => {
    try {
      const isFavorite = user?.favouriteBooks?.includes(book.bookId);
      const response = await axios.post(`https://librarymanagementsystembackend.onrender.com/api/users/toggle-favorite`, {
        bookId: book.bookId,
        action: isFavorite ? 'remove' : 'add'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 200) {
        const updatedUser = {
          ...user,
          favouriteBooks: response.data.favouriteBooks || []
        };
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const requestBook = async (book) => {
    try {
      const response = await axios.post(
        `https://librarymanagementsystembackend.onrender.com/api/users/request-book`,
        { bookId: book.bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        const updatedUser = response.data;
        updateUser(updatedUser);
        alert('Book requested successfully!');
      }
    } catch (error) {
      console.error('Error requesting book:', error);
      alert(error.response?.data?.message || 'Failed to request book');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-center text-2xl font-bold mb-6">Library Books</h1>
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      
      {books.length === 0 && !error && (
        <div className="text-center text-gray-500">Loading books...</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {books.map((book) => (
          <div key={book.bookId} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={book.bookImageLink || 'https://via.placeholder.com/150'}
              alt={book.bookName}
              className="h-48 w-full object-cover rounded-t-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            <div className="mt-4">
              <h2 className="text-lg font-bold">{book.bookName}</h2>
              <p className="text-gray-600 mt-1">By: {book.authorName}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="ml-2 text-sm text-gray-600">
                  {(book.rating || 0).toFixed(1)} / 5
                </span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={() => requestBook(book)}
                  disabled={user?.requestedBooks?.includes(book.bookId)}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-md text-sm ${
                    user?.requestedBooks?.includes(book.bookId) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-blue-600'
                  }`}
                >
                  {user?.requestedBooks?.includes(book.bookId) ? 'Requested' : 'Request Book'}
                </button>
                <button 
                  onClick={() => toggleFavorite(book)}
                  className={`${
                    user?.favouriteBooks?.includes(book.bookId) 
                      ? 'bg-gray-500 hover:bg-gray-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white px-4 py-2 rounded-md text-sm`}
                >
                  {user?.favouriteBooks?.includes(book.bookId) 
                    ? 'Remove from Favorites' 
                    : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
