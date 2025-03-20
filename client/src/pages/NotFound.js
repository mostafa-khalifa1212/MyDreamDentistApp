// client/src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF7FF]">
      <div className="text-center max-w-md px-6">
        <div className="mb-6 text-[#8E7C93]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-[#201A23] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#201A23] mb-4">Page Not Found</h2>
        
        <p className="text-[#8E7C93] mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        
        <Link
          to="/"
          className="inline-block bg-[#8E7C93] text-white py-2 px-6 rounded-md hover:bg-[#201A23] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;