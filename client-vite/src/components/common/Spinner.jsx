// client/src/components/common/Spinner.js
import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" aria-busy="true">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
