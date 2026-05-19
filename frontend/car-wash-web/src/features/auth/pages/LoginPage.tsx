import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { loginSchema, type LoginFormValues } from '../schemas';
import { ROUTES } from '@/router/routes';
import { useLogin } from '../hooks/useLogin';

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending, error } = useLogin();

  const onSubmit = (values: LoginFormValues) => {
    login({ email: values.email, password: values.password });
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-[45%]">
        <ImagePlaceholder
          label="Brand image — car being washed"
          className="w-full h-full !rounded-none"
        />
      </div>

      <div className="flex-1 flex items-center justify-center min-h-screen px-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg" aria-hidden="true" />
            <span className="text-xl font-semibold text-gray-900">WashFlow</span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">Login to your account</h1>
          <p className="text-sm text-gray-500 mt-1 mb-8">Welcome back. Enter your details below.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="mt-4">
              <Input
                label="Password"
                type="password"
                required
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="flex justify-between items-center mt-3">
              <Checkbox label="Remember me" />
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:underline"
              >
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-4">
                <p className="text-sm text-red-700">
                  {(error as AxiosError<{ message: string }>)?.response?.data?.message ??
                    'Invalid email or password.'}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              isLoading={isPending}
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?
            <a
              href={ROUTES.PUBLIC.REGISTER}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium ml-1 focus-visible:outline-none focus-visible:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
