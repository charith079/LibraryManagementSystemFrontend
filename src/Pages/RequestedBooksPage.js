import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Components/AuthContext";

const RequestedBooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, updateUser } = useAuth();

  useEffect(() => {
    const fetchRequestedBooks = async () => {
      try {
        if (user?.requestedBooks?.length > 0) {
          const response = await axios.get(`https://librarymanagementsystembackend.onrender.com/api/books/by-ids`, {
            params: { bookIds: JSON.stringify(user.requestedBooks) },
            headers: { Authorization: `Bearer ${token}` }
          });
          setBooks(response.data);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching requested books:', error);
        alert('Failed to fetch requested books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestedBooks();
  }, [user?.requestedBooks, token]);

  const handleCancelRequest = async (book) => {
    try {
      const response = await axios.post(
        `https://librarymanagementsystembackend.onrender.com/api/users/cancel-request`,
        { bookId: book.bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        // Update the user context with the new requestedBooks array
        updateUser(response.data);
        // Remove the book from the local state
        setBooks(books.filter(b => b.bookId !== book.bookId));
      }
    } catch (error) {
      console.error('Error canceling request:', error);
      alert(error.response?.data?.message || 'Failed to cancel request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-2xl font-bold mb-6">Requested Books</h1>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book._id} className="bg-white shadow-md rounded-lg p-4">
                  <img src={book.bookImageLink} alt={book.bookName} className="h-48 w-full object-cover rounded-t-lg" />
                  <div className="mt-4">
                    <h2 className="text-lg font-bold">{book.bookName}</h2>
                    <p className="text-gray-600 mt-1">By: {book.authorName}</p>
                    <div className="flex justify-end mt-4">
                      <button 
                        onClick={() => handleCancelRequest(book)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
                      >
                        Cancel Request
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">No requested books</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestedBooks;
