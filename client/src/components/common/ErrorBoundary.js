// client/src/components/common/ErrorBoundary.js
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCF7FF] p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full dark:bg-gray-800">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-[#201A23] mb-4 dark:text-white">
              Something Went Wrong
            </h1>
            
            <p className="text-[#8E7C93] text-center mb-6 dark:text-gray-300">
              An unexpected error has occurred in the application. Please try refreshing the page
              or contact support if the problem persists.
            </p>
            
            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#8E7C93] text-white py-2 px-4 rounded-md hover:bg-[#201A23] transition-colors"
              >
                Refresh Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 p-4 bg-red-50 rounded-md overflow-auto dark:bg-red-900/20">
                <p className="font-medium text-red-800 dark:text-red-200">Error Details (Development Only):</p>
                <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap dark:text-red-300">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap dark:text-red-300">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;