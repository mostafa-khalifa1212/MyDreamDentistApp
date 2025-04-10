import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = ({ title = '404', message = 'Page Not Found', linkText = 'Return to Home' }) => {

  return (
    <div className="text-center py-5">
      <h1 className="display-1">{title}</h1>
      <h2 className="mb-4">{message}</h2>
      <Link to="/" className="btn btn-primary">
        {linkText}
      </Link>
    </div>
  );
};

export default NotFound;