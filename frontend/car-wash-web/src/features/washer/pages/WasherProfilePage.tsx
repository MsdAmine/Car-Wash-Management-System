import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ChevronRight, ChevronDown, LogOut } from 'lucide-react';
import { WasherLayout } from '@/shared/components/layout/WasherLayout';
import { Button } from '@/shared/components/ui/Button';
import { useAuth } from '@/shared/context/AuthContext';
import { fetchUserProfile } from '@/features/auth/api';
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile';
import { useChangePassword } from '@/features/auth/hooks/useChangePassword';

export function WasherProfilePage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const [editingField, setEditingField] = useState<'name' | 'phone' | null>(null);
  const [nameValue, setNameValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [rowError, setRowError] = useState<string | null>(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  function handleChangePassword() {
    setPasswordError(null);
    setPasswordSuccess(false);
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setPasswordSuccess(true);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setTimeout(() => {
            setShowPasswordForm(false);
            setPasswordSuccess(false);
          }, 1500);
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message?: string }>;
          setPasswordError(axiosErr.response?.data?.message ?? 'Failed to change password.');
        },
      },
    );
  }

  useEffect(() => {
    if (profile) {
      setNameValue(`${profile.firstName} ${profile.lastName}`);
      setPhoneValue(profile.phone ?? '');
    }
  }, [profile]);

  function splitName(full: string): { firstName: string; lastName: string } {
    const parts = full.trim().split(/\s+/);
    return {
      firstName: parts[0] ?? '',
      lastName: parts.slice(1).join(' '),
    };
  }

  function handleSaveName() {
    setRowError(null);
    const { firstName, lastName } = splitName(nameValue);
    updateProfile.mutate(
      { firstName, lastName, phone: profile?.phone ?? phoneValue },
      {
        onSuccess: () => {
          setEditingField(null);
          queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message?: string }>;
          setRowError(axiosErr.response?.data?.message ?? 'Failed to save.');
        },
      },
    );
  }

  function handleSavePhone() {
    setRowError(null);
    const { firstName, lastName } = splitName(nameValue);
    updateProfile.mutate(
      { firstName, lastName, phone: phoneValue },
      {
        onSuccess: () => {
          setEditingField(null);
          queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message?: string }>;
          setRowError(axiosErr.response?.data?.message ?? 'Failed to save.');
        },
      },
    );
  }

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user
      ? `${user.firstName} ${user.lastName}`
      : '';

  return (
    <WasherLayout>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
      </header>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Identity card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <img src="/images/avatar-washer.png" alt="Profile photo" className="w-20 h-20 rounded-full mx-auto object-cover" />
          <p className="text-lg font-semibold text-gray-900 mt-3">{displayName}</p>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full inline-block mt-1">
            Car Washer
          </span>
        </div>

        {/* Editable info card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Account info</span>
          </div>

          {/* Name row */}
          <div className="px-4 py-3 border-b border-gray-100">
            {editingField === 'name' ? (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Name</span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                />
                {rowError && editingField === 'name' && (
                  <p className="text-xs text-red-600 mt-1">{rowError}</p>
                )}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
                    onClick={() => { setEditingField(null); setRowError(null); }}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded disabled:opacity-50"
                    onClick={handleSaveName}
                    disabled={updateProfile.isPending}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="text-sm text-gray-900 font-medium mt-0.5">{displayName}</p>
                </div>
                <button
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  onClick={() => setEditingField('name')}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Phone row */}
          <div className="px-4 py-3 border-b border-gray-100">
            {editingField === 'phone' ? (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Phone</span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                />
                {rowError && editingField === 'phone' && (
                  <p className="text-xs text-red-600 mt-1">{rowError}</p>
                )}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
                    onClick={() => { setEditingField(null); setRowError(null); }}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded disabled:opacity-50"
                    onClick={handleSavePhone}
                    disabled={updateProfile.isPending}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-gray-900 font-medium mt-0.5">{profile?.phone ?? '—'}</p>
                </div>
                <button
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  onClick={() => setEditingField('phone')}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Email row — read-only */}
          <div className="px-4 py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <p className="text-sm text-gray-900 font-medium mt-0.5">
                  {profile?.email ?? user?.email ?? '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-xl border border-gray-200">
          <button
            className="w-full px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 rounded-xl"
            onClick={() => { setShowPasswordForm((v) => !v); setPasswordError(null); setPasswordSuccess(false); }}
          >
            <span className="text-sm font-medium text-gray-900">Change password</span>
            {showPasswordForm
              ? <ChevronDown className="w-4 h-4 text-gray-400" />
              : <ChevronRight className="w-4 h-4 text-gray-400" />}
          </button>
          {showPasswordForm && (
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3">
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <input
                type="password"
                placeholder="New password (min 8 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
              {passwordSuccess && <p className="text-xs text-green-600">Password changed successfully.</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
                  onClick={() => { setShowPasswordForm(false); setPasswordError(null); }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded disabled:opacity-50"
                  onClick={handleChangePassword}
                  disabled={changePassword.isPending}
                >
                  {changePassword.isPending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-red-500 border border-red-200 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </WasherLayout>
  );
}
