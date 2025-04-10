// client/src/components/common/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI on error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In a production app, report to an error reporting service like Sentry, Bugsnag, etc.:
    // reportError(error, errorInfo); 
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-5">
          <h1 className="display-4">Oops!</h1>
          <h2>An unexpected error occurred.</h2>
          <p>Please try refreshing the page or return to the home page.</p>
          <a href="/" className="btn btn-primary">
            Return to Home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
