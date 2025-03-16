import React, { useState, useEffect } from "react";
import { useAuth } from "../Components/AuthContext";
import axios from 'axios';
// require('dotenv').config();

const BooksInHand = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchBooksInHand = async () => {
      try {
        if (user?.booksInHand?.length > 0) {
          const bookIds = user.booksInHand.map(book => book.bookId);
          const response = await axios.get(`https://librarymanagementsystembackend.onrender.com/api/books/by-ids`, {
            params: { bookIds: JSON.stringify(bookIds) }
          });
          
          // Merge book details with taken dates
          const booksWithDates = response.data.map(book => ({
            ...book,
            takenDate: user.booksInHand.find(b => b.bookId === book.bookId)?.takenDate
          }));
          
          setBooks(booksWithDates);
        }
      } catch (error) {
        console.error('Error fetching books in hand:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooksInHand();
  }, [user?.booksInHand]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-2xl font-bold mb-6">Books in Hand</h1>
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
                    <p className="text-gray-600 mt-1">Taken on: {new Date(book.takenDate).toLocaleDateString()}</p>
                    <div className="flex justify-end mt-4">
                      <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600">
                        Return Book
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">No books in hand</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksInHand;
