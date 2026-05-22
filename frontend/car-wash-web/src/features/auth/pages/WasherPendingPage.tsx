import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { useAuth } from '@/shared/context/AuthContext';

const steps = [
  'An admin will review your registration.',
  'You\'ll receive a confirmation once activated.',
  'Log in and start receiving job assignments.',
] as const;

export function WasherPendingPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md p-8 text-center">

        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-amber-500" />
        </div>

        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          Account pending approval
        </h1>

        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
          Your account has been created and is waiting for admin approval.
          You'll be able to log in once your account is activated.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 text-left">
          <p className="text-sm font-semibold text-amber-800 mb-3">What happens next?</p>
          <div className="flex flex-col gap-2">
            {steps.map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 bg-amber-200 text-amber-800 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-amber-700">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 mt-6 pt-6">
          <span className="text-sm text-gray-500">Already activated?</span>
          <Link
            to={ROUTES.PUBLIC.LOGIN}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium ml-1"
          >
            Go to login
          </Link>
        </div>

        <div className="mt-3">
          <span className="text-sm text-gray-400">Not your account?</span>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium ml-1 cursor-pointer"
          >
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
}
