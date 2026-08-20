import React from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CycleCare ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
          <div className="card max-w-md w-full text-center p-8 flex flex-col items-center gap-4 shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-500 mb-2">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              An unexpected error occurred while rendering this page. Don't worry, your health data is safe!
            </p>
            {this.state.error?.message && (
              <div className="w-full bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-mono text-left overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 mt-4 w-full justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Refresh Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" /> Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
