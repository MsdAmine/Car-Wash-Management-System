import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { ROUTES } from '@/router/routes';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="mt-4 text-xl font-semibold text-gray-900">Access denied</h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
          You do not have permission to view this page.
        </p>

        <Link
          to={ROUTES.PUBLIC.LOGIN}
          className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 px-4 py-2 text-sm mt-6"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
