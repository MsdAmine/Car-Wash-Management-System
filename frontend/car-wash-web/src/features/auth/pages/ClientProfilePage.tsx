import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { AlertTriangle } from 'lucide-react';
import { ClientLayout } from '@/shared/components/layout/ClientLayout';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { ToggleSwitch } from '@/shared/components/ui/ToggleSwitch';
import { NavItem } from '@/shared/components/ui/NavItem';
import { useAuth } from '@/shared/context/AuthContext';
import { fetchUserProfile } from '@/features/auth/api';
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile';

// ─── Personal info section ────────────────────────────────────────────────────

function PersonalInfoSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setPhone(profile.phone ?? '');
    }
  }, [profile]);

  function handleSave() {
    setSaveError(null);
    updateProfile.mutate(
      { firstName, lastName, phone },
      {
        onSuccess: () => {
          setIsEditing(false);
          queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message?: string }>;
          setSaveError(axiosErr.response?.data?.message ?? 'Failed to save changes.');
        },
      },
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <span className="text-base font-semibold text-gray-900">Personal information</span>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100">
          <ImagePlaceholder label="Profile photo" className="w-16 h-16 rounded-full" />
          <div>
            <p className="text-base font-semibold text-gray-900">
              {profile?.firstName ?? user?.firstName} {profile?.lastName ?? user?.lastName}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{profile?.email ?? user?.email}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => console.log('upload photo')}
            >
              Upload photo
            </Button>
          </div>
        </div>

        {!isEditing && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">First name</p>
              <p className="text-sm text-gray-900 mt-1">{profile?.firstName ?? user?.firstName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last name</p>
              <p className="text-sm text-gray-900 mt-1">{profile?.lastName ?? user?.lastName}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
              <p className="text-sm text-gray-900 mt-1">{profile?.email ?? user?.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
              <p className="text-sm text-gray-900 mt-1">{profile?.phone ?? '—'}</p>
            </div>
          </div>
        )}

        {isEditing && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Last name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <Input
                label="Email"
                type="email"
                value={profile?.email ?? user?.email ?? ''}
                disabled
                className="opacity-50 cursor-not-allowed"
              />
            </div>
            <div className="mt-4">
              <Input
                label="Phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {saveError && (
              <p className="text-sm text-red-600 mt-3">{saveError}</p>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setSaveError(null); }}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={updateProfile.isPending}
                onClick={handleSave}
              >
                Save changes
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Notifications section ────────────────────────────────────────────────────

const NOTIFICATION_ROWS = [
  { key: 'booking_confirmed', label: 'Booking confirmed', description: 'Get notified when a booking is confirmed.' },
  { key: 'wash_in_progress',  label: 'Wash in progress',  description: 'Get notified when your wash starts.' },
  { key: 'wash_completed',    label: 'Wash completed',    description: 'Get notified when your wash is done.' },
  { key: 'booking_reminders', label: 'Booking reminders', description: 'Reminder 24 hours before your appointment.' },
  { key: 'promotions',        label: 'Promotions',        description: 'Occasional offers and service updates.' },
];

function NotificationsSection() {
  // TODO: no backend endpoint for notification preferences yet — local state only
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    booking_confirmed: true,
    wash_in_progress: true,
    wash_completed: true,
    booking_reminders: true,
    promotions: false,
  });

  function handleToggle(key: string) {
    setToggleStates((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Notification preferences</h2>
      <div className="flex flex-col divide-y divide-gray-100">
        {NOTIFICATION_ROWS.map(({ key, label, description }) => (
          <div key={key} className="py-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </div>
            <ToggleSwitch
              checked={toggleStates[key]}
              onChange={() => handleToggle(key)}
              label={`Toggle ${label}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Change password section ──────────────────────────────────────────────────

function ChangePasswordSection() {
  // TODO: no change-password endpoint yet
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Change password</h2>
      <div className="flex flex-col gap-4">
        <Input label="Current password" type="password" />
        <Input label="New password" type="password" />
        <Input label="Confirm new password" type="password" />
      </div>
      <div className="flex justify-end mt-6">
        <Button variant="primary" size="sm" onClick={() => console.log('update password')}>
          Update password
        </Button>
      </div>
    </div>
  );
}

// ─── Delete account section ───────────────────────────────────────────────────

function DeleteAccountSection() {
  // TODO: no delete-account endpoint yet
  const [confirmValue, setConfirmValue] = useState('');

  return (
    <div className="bg-white rounded-xl border border-red-200 p-6">
      <div className="bg-red-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-700">
          <AlertTriangle className="w-5 h-5 text-red-500 inline mr-2" />
          This action is permanent and cannot be undone. All your bookings, vehicles, and account
          data will be deleted.
        </p>
      </div>
      <div>
        <label htmlFor="delete-confirm" className="text-sm font-medium text-gray-700">
          Type <span className="font-mono font-semibold">"DELETE"</span> to confirm
        </label>
        <input
          id="delete-confirm"
          type="text"
          value={confirmValue}
          onChange={(e) => setConfirmValue(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full mt-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
        />
      </div>
      <div className="mt-4">
        <Button
          variant="danger"
          size="sm"
          disabled={confirmValue !== 'DELETE'}
          onClick={() => console.log('delete account')}
        >
          Delete my account
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Section = 'personal' | 'notifications' | 'password' | 'delete';

export function ClientProfilePage() {
  const [activeSection, setActiveSection] = useState<Section>('personal');

  return (
    <ClientLayout>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>

        <div className="grid grid-cols-4 gap-8">
          <nav className="col-span-1 sticky top-20 self-start" aria-label="Settings navigation">
            <NavItem label="Personal info" isActive={activeSection === 'personal'} onClick={() => setActiveSection('personal')} />
            <NavItem label="Notifications" isActive={activeSection === 'notifications'} onClick={() => setActiveSection('notifications')} />
            <NavItem label="Change password" isActive={activeSection === 'password'} onClick={() => setActiveSection('password')} />

            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 mt-6 px-3">
              Danger zone
            </p>
            <button
              type="button"
              onClick={() => setActiveSection('delete')}
              className={`text-sm px-3 py-2 rounded-lg block w-full text-left transition-colors ${
                activeSection === 'delete'
                  ? 'bg-red-50 text-red-700 font-medium'
                  : 'text-red-500 hover:text-red-600 hover:bg-gray-100'
              }`}
            >
              Delete account
            </button>
          </nav>

          <div className="col-span-3">
            {activeSection === 'personal' && <PersonalInfoSection />}
            {activeSection === 'notifications' && <NotificationsSection />}
            {activeSection === 'password' && <ChangePasswordSection />}
            {activeSection === 'delete' && <DeleteAccountSection />}
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
