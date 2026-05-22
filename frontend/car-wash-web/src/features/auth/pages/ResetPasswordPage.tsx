import type { AxiosError } from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { ROUTES } from '@/router/routes';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '../schemas';
import { useResetPassword } from '../hooks/useResetPassword';

function formatExpiry(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleString();
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const expiresAt = formatExpiry(searchParams.get('expiresAt'));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: submitReset, isPending, error } = useResetPassword();

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!token) return;

    submitReset({
      token,
      newPassword: values.password,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Create a new password</h1>
        <p className="text-sm text-gray-500 mt-2 mb-8">
          {expiresAt
            ? `This reset link expires on ${expiresAt}.`
            : 'Enter a new password for your account.'}
        </p>

        {!token ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-sm text-amber-800">
                This reset link is missing its token. Start the flow again from forgot password.
              </p>
            </div>
            <Link
              to={ROUTES.PUBLIC.FORGOT_PASSWORD}
              className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="New password"
              type="password"
              required
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="mt-4">
              <Input
                label="Confirm password"
                type="password"
                required
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-4">
                <p className="text-sm text-red-700">
                  {(error as AxiosError<{ message: string }>)?.response?.data?.message ??
                    'Could not reset password.'}
                </p>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full mt-6" isLoading={isPending}>
              Save new password
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link
            to={ROUTES.PUBLIC.LOGIN}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
