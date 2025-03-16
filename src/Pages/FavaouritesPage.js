import React, { useState, useEffect } from "react";
import { useAuth } from "../Components/AuthContext";
import axios from 'axios';

const Favorites = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, updateUser } = useAuth();

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        if (user?.favouriteBooks?.length > 0) {
          const response = await axios.get(`https://librarymanagementsystembackend.onrender.com/api/books/by-ids`, {
            params: { bookIds: JSON.stringify(user.favouriteBooks) }
          });
          setFavoriteBooks(response.data);
        } else {
          setFavoriteBooks([]);
        }
      } catch (error) {
        console.error('Error fetching favorite books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteBooks();
  }, [user?.favouriteBooks]);

  const toggleFavorite = async (book) => {
    try {
      const response = await axios.post(
        `https://librarymanagementsystembackend.onrender.com/api/users/toggle-favorite`,
        {
          bookId: book.bookId,
          action: 'remove'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.status === 200) {
        // Update user context
        updateUser(response.data);
        // Remove book from local state immediately
        setFavoriteBooks(currentBooks => 
          currentBooks.filter(b => b.bookId !== book.bookId)
        );
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove book from favorites');
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
        updateUser(response.data);
        alert('Book requested successfully!');
      }
    } catch (error) {
      console.error('Error requesting book:', error);
      alert(error.response?.data?.message || 'Failed to request book');
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-center text-2xl font-bold mb-6">Favorite Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {favoriteBooks.map((book) => (
          // Similar card structure as BooksPage
          <div key={book._id} className="bg-white shadow-md rounded-lg p-4">
            <img src={book.bookImageLink} alt={book.bookName} className="h-48 w-full object-cover rounded-t-lg" />
            <div className="mt-4">
              <h2 className="text-lg font-bold">{book.bookName}</h2>
              <p className="text-gray-600 mt-1">By: {book.authorName}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="ml-2 text-sm text-gray-600">{book.rating.toFixed(1)} / 5</span>
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
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          </div>
        ))}
        {favoriteBooks.length === 0 && (
          <p className="text-center text-gray-600 col-span-full">No favorite books yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
