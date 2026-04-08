import { ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-gray-400 mb-4">
        <ShieldOff className="h-12 w-12" />
      </div>
      <h2 className="text-lg font-medium text-gray-900">Access Denied</h2>
      <p className="mt-1 text-sm text-gray-500">
        You don't have permission to view this page.
      </p>
      <Link
        to="/admin"
        className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
