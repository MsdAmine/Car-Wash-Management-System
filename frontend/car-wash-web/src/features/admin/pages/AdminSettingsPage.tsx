import { useState } from 'react';
import { Info } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { ToggleSwitch } from '@/shared/components/ui/ToggleSwitch';
import { NavItem } from '@/shared/components/ui/NavItem';

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_BUSINESS = {
  name: 'WashFlow HQ',
  phone: '+1 555 0100',
  address: '123 Main Street',
  city: 'San Francisco, CA',
};

const MOCK_HOURS: Record<string, { open: string; close: string; isOpen: boolean }> = {
  Monday:    { open: '08:00', close: '18:00', isOpen: true },
  Tuesday:   { open: '08:00', close: '18:00', isOpen: true },
  Wednesday: { open: '08:00', close: '18:00', isOpen: true },
  Thursday:  { open: '08:00', close: '18:00', isOpen: true },
  Friday:    { open: '08:00', close: '20:00', isOpen: true },
  Saturday:  { open: '09:00', close: '17:00', isOpen: true },
  Sunday:    { open: '00:00', close: '00:00', isOpen: false },
};

const MOCK_POLICY = { cancellationHours: 24 };

// ─── Sub-nav ──────────────────────────────────────────────────────────────────

type Section = 'business' | 'hours' | 'notifications' | 'cancellation';

// ─── Business info section ────────────────────────────────────────────────────

function BusinessInfoSection() {
  const [isEditing, setIsEditing] = useState(false);

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
          <div className="flex items-center gap-4 pb-6 mb-2 border-b border-gray-100">
            <ImagePlaceholder label="Business logo" className="w-16 h-16 rounded-xl" />
            <div>
              <p className="text-base font-semibold text-gray-900">{MOCK_BUSINESS.name}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1"
                onClick={() => console.log('upload logo')}
              >
                Upload logo
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Business name</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{MOCK_BUSINESS.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{MOCK_BUSINESS.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{MOCK_BUSINESS.address}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">City</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{MOCK_BUSINESS.city}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-6">
          <div className="flex items-center gap-4 pb-6 mb-2 border-b border-gray-100">
            <ImagePlaceholder label="Business logo" className="w-16 h-16 rounded-xl" />
            <div>
              <p className="text-base font-semibold text-gray-900">{MOCK_BUSINESS.name}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1"
                onClick={() => console.log('upload logo')}
              >
                Upload logo
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <Input label="Business name" required defaultValue={MOCK_BUSINESS.name} />
            <Input label="Phone" type="tel" defaultValue={MOCK_BUSINESS.phone} />
            <Input label="Address" defaultValue={MOCK_BUSINESS.address} />
            <Input label="City" defaultValue={MOCK_BUSINESS.city} />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => console.log('save business info')}>
              Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Operating hours section ──────────────────────────────────────────────────

function OperatingHoursSection() {
  const [hours, setHours] = useState<Record<string, { open: string; close: string; isOpen: boolean }>>(MOCK_HOURS);

  function toggleDay(day: string) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], isOpen: !prev[day].isOpen } }));
  }

  function updateTime(day: string, field: 'open' | 'close', value: string) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Operating hours</h2>
      <div className="flex flex-col divide-y divide-gray-100">
        {Object.entries(hours).map(([day, { open, close, isOpen }]) => (
          <div key={day} className="py-4 flex items-center gap-4">
            <ToggleSwitch
              checked={isOpen}
              onChange={() => toggleDay(day)}
              label={`Toggle ${day} open`}
            />
            <span className={`w-24 text-sm font-medium ${isOpen ? 'text-gray-900' : 'text-gray-400'}`}>
              {day}
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
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <Button variant="primary" size="sm" onClick={() => console.log('save hours')}>
          Save hours
        </Button>
      </div>
    </div>
  );
}

// ─── Notifications section ────────────────────────────────────────────────────

const ADMIN_NOTIFICATION_ROWS = [
  { key: 'new_booking',         label: 'New booking',         description: 'Alert when a new booking is created.' },
  { key: 'booking_cancelled',   label: 'Booking cancelled',   description: 'Alert when a client cancels.' },
  { key: 'unassigned_bookings', label: 'Unassigned bookings', description: 'Daily digest of unassigned jobs.' },
  { key: 'staff_activity',      label: 'Staff activity',      description: 'Updates when washers start or complete jobs.' },
];

function NotificationsSection() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    new_booking: true,
    booking_cancelled: true,
    unassigned_bookings: true,
    staff_activity: true,
  });

  function handleToggle(key: string) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
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
              checked={notifications[key]}
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
  const [cancellationHours, setCancellationHours] = useState(MOCK_POLICY.cancellationHours);

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
          defaultValue={MOCK_POLICY.cancellationHours}
          onChange={(e) => setCancellationHours(Number(e.target.value))}
          className="w-32"
        />
        <span className="text-sm text-gray-500 mt-5">hours</span>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
        <p className="text-sm text-blue-700">
          <Info className="w-4 h-4 text-blue-500 inline mr-2" />
          Clients can cancel for free up to {cancellationHours} hours before their appointment.
        </p>
      </div>
      <div className="flex justify-end mt-6">
        <Button variant="primary" size="sm" onClick={() => console.log('save policy')}>
          Save policy
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('business');

  const topBar = <span className="text-lg font-semibold text-gray-900">Settings</span>;

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
