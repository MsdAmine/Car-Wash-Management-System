import type { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { ROUTES } from '@/router/routes';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../schemas';
import { useForgotPassword } from '../hooks/useForgotPassword';

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: requestReset, isPending, error } = useForgotPassword();

  const onSubmit = (values: ForgotPasswordFormValues) => {
    requestReset(values);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Reset your password</h1>
        <p className="text-sm text-gray-500 mt-2 mb-8">
          Enter your account email and continue to create a new password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-4">
              <p className="text-sm text-red-700">
                {(error as AxiosError<{ message: string }>)?.response?.data?.message ??
                  'Could not start password reset.'}
              </p>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full mt-6" isLoading={isPending}>
            Continue
          </Button>
        </form>

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
