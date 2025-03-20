// client/src/components/common/Spinner.js
import React from 'react';

const Spinner = ({ size = 'medium', className = '' }) => {
  // Determine classes based on size
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.medium;
  
  return (
    <div className={`inline-block ${className}`}>
      <div className={`${sizeClass} animate-spin rounded-full border-solid border-[#8E7C93] border-t-transparent`}></div>
    </div>
  );
};

export default Spinner;
