'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
export default function Declined() {

    const router = useRouter();
    const [previousUrl, setPreviousUrl] = useState('/');

    useEffect(() => {
        // Safely get the search params (client-side only)
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          setPreviousUrl(params.get('prev') || '/');
        }
      }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        {/* Sad face icon */}
        <div className="text-6xl text-gray-500 mb-4">😔</div>

        {/* Main Heading */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h1>

        {/* Subheading */}
        <p className="text-gray-600 mb-6">
          You need to accept the Terms of Use to access this website.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {/* Review Terms Button */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => router.push(previousUrl)}
          >
            Review Terms
          </button>

        </div>
      </div>
    </div>
  )
}
