import { useEffect, useRef, useState } from 'react';
import { Info, LogOut } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { ToggleSwitch } from '@/shared/components/ui/ToggleSwitch';
import { NavItem } from '@/shared/components/ui/NavItem';
import { useAuth } from '@/shared/context/AuthContext';
import { useBusinessSettings, SETTINGS_KEYS } from '../hooks/useBusinessSettings';
import { useUpdateBusinessSettings } from '../hooks/useUpdateBusinessSettings';
import { useOperatingHours } from '../hooks/useOperatingHours';
import { useUpdateOperatingHours } from '../hooks/useUpdateOperatingHours';
import { fetchNotificationPreferences } from '@/features/auth/api';
import { useUpdateNotifications } from '@/features/auth/hooks/useUpdateNotifications';
import type { NotificationPreferences } from '@/features/auth/types';

const LOGO_STORAGE_KEY = 'business_logo';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function apiErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string } | undefined)?.message;
    return msg ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

const DAY_ORDER = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;

// ─── Sub-nav ──────────────────────────────────────────────────────────────────

type Section = 'business' | 'hours' | 'notifications' | 'cancellation';

// ─── Business info section ────────────────────────────────────────────────────

function BusinessInfoSection() {
  const { data: settings, isLoading: settingsLoading } = useBusinessSettings();
  const updateSettings = useUpdateBusinessSettings();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [logoSrc, setLogoSrc] = useState<string>(
    () => localStorage.getItem(LOGO_STORAGE_KEY) ?? '/images/logo-business.png',
  );

  useEffect(() => {
    if (settings) {
      setName(settings.businessName);
      setPhone(settings.phone);
      setAddress(settings.address);
      setCity(settings.city);
    }
  }, [settings]);

  function handleLogoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem(LOGO_STORAGE_KEY, dataUrl);
      setLogoSrc(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const logoBlock = (
    <div className="flex items-center gap-4 pb-6 mb-2 border-b border-gray-100">
      <img src={logoSrc} alt="Business logo" className="w-16 h-16 rounded-xl object-cover" />
      <div>
        <p className="text-base font-semibold text-gray-900">{settings?.businessName}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoFileChange}
        />
        <Button
          variant="ghost"
          size="sm"
          className="mt-1"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload logo
        </Button>
      </div>
    </div>
  );

  if (settingsLoading) {
    return <div className="bg-gray-100 animate-pulse h-48 rounded-xl" />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <span className="text-base font-semibold text-gray-900">Business information</span>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {!isEditing ? (
        <div className="px-6 py-6 flex flex-col gap-4">
          {logoBlock}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Business name</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{settings?.businessName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{settings?.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{settings?.address}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">City</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{settings?.city}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-6">
          {logoBlock}
          <div className="flex flex-col gap-4 mt-4">
            <Input
              label="Business name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          {updateSettings.error && (
            <p className="text-sm text-red-600 mt-4">
              {apiErrorMessage(updateSettings.error)}
            </p>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={updateSettings.isPending}
              onClick={() =>
                updateSettings.mutate(
                  {
                    businessName: name,
                    phone,
                    address,
                    city,
                    cancellationHours: settings?.cancellationHours ?? 24,
                  },
                  {
                    onSuccess: () => {
                      setIsEditing(false);
                      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.business() });
                    },
                  },
                )
              }
            >
              {updateSettings.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Operating hours section ──────────────────────────────────────────────────

function OperatingHoursSection() {
  const { data: hours, isLoading: hoursLoading } = useOperatingHours();
  const updateHours = useUpdateOperatingHours();
  const queryClient = useQueryClient();
  const [hoursState, setHoursState] = useState<
    Record<string, { open: string; close: string; isOpen: boolean }>
  >({});

  useEffect(() => {
    if (hours) {
      const map: Record<string, { open: string; close: string; isOpen: boolean }> = {};
      hours.forEach((h) => {
        map[h.dayOfWeek] = {
          open: h.openTime,
          close: h.closeTime,
          isOpen: h.isOpen,
        };
      });
      setHoursState(map);
    }
  }, [hours]);

  function toggleDay(day: string) {
    setHoursState((prev) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  }

  function updateTime(day: string, field: 'open' | 'close', value: string) {
    setHoursState((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  if (hoursLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-6 w-40 bg-gray-100 animate-pulse rounded mb-6" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Operating hours</h2>
      <div className="flex flex-col divide-y divide-gray-100">
        {DAY_ORDER.map((day) => {
          const entry = hoursState[day];
          const isOpen = entry?.isOpen ?? false;
          const open = entry?.open ?? '08:00';
          const close = entry?.close ?? '18:00';
          const label = day.charAt(0) + day.slice(1).toLowerCase();
          return (
            <div key={day} className="py-4 flex items-center gap-4">
              <ToggleSwitch
                checked={isOpen}
                onChange={() => toggleDay(day)}
                label={`Toggle ${label} open`}
              />
              <span className={`w-24 text-sm font-medium ${isOpen ? 'text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                {isOpen ? (
                  <>
                    <input
                      type="time"
                      value={open}
                      onChange={(e) => updateTime(day, 'open', e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <span className="text-xs text-gray-400">to</span>
                    <input
                      type="time"
                      value={close}
                      onChange={(e) => updateTime(day, 'close', e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </>
                ) : (
                  <span className="text-sm text-gray-400 italic">Closed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-end gap-2 mt-6">
        <Button
          variant="primary"
          size="sm"
          disabled={updateHours.isPending}
          onClick={() =>
            updateHours.mutate(
              {
                days: DAY_ORDER.map((day) => ({
                  dayOfWeek: day,
                  openTime: hoursState[day]?.open ?? '08:00',
                  closeTime: hoursState[day]?.close ?? '18:00',
                  isOpen: hoursState[day]?.isOpen ?? true,
                })),
              },
              {
                onSuccess: () =>
                  queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.hours() }),
              },
            )
          }
        >
          {updateHours.isPending ? 'Saving…' : 'Save hours'}
        </Button>
        {updateHours.error && (
          <p className="text-sm text-red-600">{apiErrorMessage(updateHours.error)}</p>
        )}
      </div>
    </div>
  );
}

// ─── Notifications section ────────────────────────────────────────────────────

const ADMIN_NOTIFICATION_ROWS: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: 'bookingConfirmed', label: 'New booking confirmed', description: 'Alert when a new booking is created.' },
  { key: 'washInProgress',   label: 'Wash in progress',     description: 'Alert when a washer starts a job.' },
  { key: 'washCompleted',    label: 'Wash completed',        description: 'Alert when a job is marked complete.' },
  { key: 'bookingReminders', label: 'Booking reminders',    description: 'Daily digest of upcoming bookings.' },
];

const NOTIFICATIONS_KEY = ['notifications', 'preferences'] as const;

function NotificationsSection() {
  const updateNotifications = useUpdateNotifications();
  const { data, isLoading } = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: fetchNotificationPreferences,
  });

  const [prefs, setPrefs] = useState<NotificationPreferences>({
    bookingConfirmed: true,
    washInProgress: true,
    washCompleted: true,
    bookingReminders: true,
    promotions: false,
  });

  useEffect(() => {
    if (data) setPrefs(data);
  }, [data]);

  function handleToggle(key: keyof NotificationPreferences) {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    updateNotifications.mutate(updated);
  }

  if (isLoading) {
    return <div className="bg-gray-100 animate-pulse h-48 rounded-xl" />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Notification settings</h2>
      <div className="flex flex-col divide-y divide-gray-100">
        {ADMIN_NOTIFICATION_ROWS.map(({ key, label, description }) => (
          <div key={key} className="py-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </div>
            <ToggleSwitch
              checked={prefs[key] as boolean}
              onChange={() => handleToggle(key)}
              label={`Toggle ${label}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Cancellation policy section ──────────────────────────────────────────────

function CancellationPolicySection() {
  const { data: settings, isLoading: settingsLoading } = useBusinessSettings();
  const updateSettings = useUpdateBusinessSettings();
  const [cancellationHoursInput, setCancellationHoursInput] = useState<string>('24');

  useEffect(() => {
    if (settings) {
      setCancellationHoursInput(String(settings.cancellationHours));
    }
  }, [settings]);

  if (settingsLoading) {
    return <div className="bg-gray-100 animate-pulse h-48 rounded-xl" />;
  }

  const displayHours = cancellationHoursInput !== '' ? Number(cancellationHoursInput) : (settings?.cancellationHours ?? 24);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-2">Cancellation policy</h2>
      <p className="text-sm text-gray-500 mb-6">
        Set the minimum notice period for free cancellations.
      </p>
      <div className="flex items-center gap-3">
        <Input
          label="Hours notice required"
          type="number"
          value={cancellationHoursInput}
          onChange={(e) => setCancellationHoursInput(e.target.value)}
          className="w-32"
        />
        <span className="text-sm text-gray-500 mt-5">hours</span>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
        <p className="text-sm text-blue-700">
          <Info className="w-4 h-4 text-blue-500 inline mr-2" />
          Clients can cancel for free up to {displayHours} hours before their appointment.
        </p>
      </div>
      {updateSettings.error && (
        <p className="text-sm text-red-600 mt-4">{apiErrorMessage(updateSettings.error)}</p>
      )}
      <div className="flex justify-end mt-6">
        <Button
          variant="primary"
          size="sm"
          disabled={updateSettings.isPending}
          onClick={() =>
            updateSettings.mutate({
              businessName: settings?.businessName ?? '',
              phone: settings?.phone ?? '',
              address: settings?.address ?? '',
              city: settings?.city ?? '',
              cancellationHours: Number(cancellationHoursInput),
            })
          }
        >
          {updateSettings.isPending ? 'Saving…' : 'Save policy'}
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminSettingsPage() {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('business');

  const topBar = (
    <>
      <span className="text-lg font-semibold text-gray-900">Settings</span>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={logout}
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>
    </>
  );

  return (
    <AdminLayout topBar={topBar}>
      <div className="grid grid-cols-4 gap-8">
        <nav className="col-span-1 sticky top-20 self-start" aria-label="Settings navigation">
          <NavItem label="Business info"       isActive={activeSection === 'business'}      onClick={() => setActiveSection('business')} />
          <NavItem label="Operating hours"     isActive={activeSection === 'hours'}         onClick={() => setActiveSection('hours')} />
          <NavItem label="Notifications"       isActive={activeSection === 'notifications'} onClick={() => setActiveSection('notifications')} />
          <NavItem label="Cancellation policy" isActive={activeSection === 'cancellation'}  onClick={() => setActiveSection('cancellation')} />
        </nav>

        <div className="col-span-3">
          {activeSection === 'business'      && <BusinessInfoSection />}
          {activeSection === 'hours'         && <OperatingHoursSection />}
          {activeSection === 'notifications' && <NotificationsSection />}
          {activeSection === 'cancellation'  && <CancellationPolicySection />}
        </div>
      </div>
    </AdminLayout>
  );
}
