import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-yellow-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl text-slate-400 mb-6">Page Not Found</h2>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Home className="w-5 h-5" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}