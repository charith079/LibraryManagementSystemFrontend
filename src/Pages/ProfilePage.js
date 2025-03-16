import React, { useState, useEffect } from "react";
import { useAuth } from "../Components/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth(); // Access the user data from context

  if (!user) {
    return (
      <div className="text-center">
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto max-w-lg bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Profile
        </h1>

        <div className="space-y-4">
          {/* Name */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-semibold text-gray-700">Name:</h2>
            <p className="text-gray-600">{user.username}</p>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-semibold text-gray-700">Email:</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Fine Amount */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-semibold text-gray-700">Fine Amount:</h2>
            <p className="text-gray-600">
              ₹{user.fineAmount.toFixed(2)} {/* Formats fine amount */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
