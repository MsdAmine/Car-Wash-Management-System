import type { AxiosError } from 'axios';
import { useState, type ElementType } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Car, Droplets } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { ROUTES } from '@/router/routes';
import { registerStep2Schema, type RegisterStep2Values } from '../schemas';
import { useRegister } from '../hooks/useRegister';

type Role = 'CUSTOMER' | 'EMPLOYEE';

interface RoleCardProps {
  selected: boolean;
  onClick: () => void;
  icon: ElementType;
  title: string;
  description: string;
}

function RoleCard({ selected, onClick, icon: Icon, title, description }: RoleCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={[
        'border-2 rounded-xl p-4 cursor-pointer flex items-start gap-4 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1',
        selected
          ? 'border-indigo-600 bg-indigo-50'
          : 'border-gray-200 bg-white hover:border-gray-300',
      ].join(' ')}
    >
      <Icon className={`w-6 h-6 mt-0.5 flex-shrink-0 ${selected ? 'text-indigo-600' : 'text-gray-400'}`} />
      <div>
        <p className="text-base font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

interface Step1Props {
  role: Role | null;
  setRole: (role: Role) => void;
  onContinue: () => void;
}

function Step1({ role, setRole, onContinue }: Step1Props) {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Choose how you'll be using WashFlow.</p>

      <div className="flex flex-col gap-3">
        <RoleCard
          selected={role === 'CUSTOMER'}
          onClick={() => setRole('CUSTOMER')}
          icon={Car}
          title="Client"
          description="Book car wash services and track your vehicles."
        />
        <RoleCard
          selected={role === 'EMPLOYEE'}
          onClick={() => setRole('EMPLOYEE')}
          icon={Droplets}
          title="Car Washer"
          description="Manage your assigned jobs and update wash status."
        />
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full mt-6"
        disabled={role === null}
        onClick={onContinue}
      >
        Continue
      </Button>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?
        <Link
          to={ROUTES.PUBLIC.LOGIN}
          className="text-indigo-600 font-medium ml-1 hover:text-indigo-700 focus-visible:outline-none focus-visible:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

interface Step2Props {
  role: Role;
  onRegister: (values: RegisterStep2Values) => void;
  isPending: boolean;
  error: Error | null;
}

function Step2({ role, onRegister, isPending, error }: Step2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStep2Values>({
    resolver: zodResolver(registerStep2Schema),
  });

  const roleLabel = role === 'CUSTOMER' ? 'Client' : 'Car Washer';

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">Your details</h1>
      <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full mt-2 mb-6">
        {roleLabel}
      </span>

      <form onSubmit={handleSubmit(onRegister)} noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            required
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last name"
            required
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <div className="mt-4">
          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="mt-4">
          <Input
            label="Phone"
            type="tel"
            required
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div className="mt-4">
          <Input
            label="Password"
            type="password"
            required
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-4">
            <p className="text-sm text-red-700">
              {(error as AxiosError<{ message: string }>)?.response?.data?.message ??
                'Registration failed. Please try again.'}
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
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?
        <Link
          to={ROUTES.PUBLIC.LOGIN}
          className="text-indigo-600 font-medium ml-1 hover:text-indigo-700 focus-visible:outline-none focus-visible:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

const backLinkClasses =
  'flex items-center text-sm text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded';

export function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const { mutate: register, isPending, error } = useRegister();

  function handleRegister(values: RegisterStep2Values) {
    register({
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      role: role!,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          {step === 1 ? (
            <Link to={ROUTES.PUBLIC.LOGIN} className={backLinkClasses}>
              <ChevronLeft className="w-4 h-4" />
              Back to login
            </Link>
          ) : (
            <button type="button" onClick={() => setStep(1)} className={backLinkClasses}>
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
          </div>
        </div>

        {step === 1 ? (
          <Step1 role={role} setRole={setRole} onContinue={() => setStep(2)} />
        ) : (
          <Step2
            role={role!}
            onRegister={handleRegister}
            isPending={isPending}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
