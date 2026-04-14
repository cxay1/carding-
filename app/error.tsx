'use client';

import { useEffect } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body className="bg-slate-900">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-slate-400 mb-6">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}