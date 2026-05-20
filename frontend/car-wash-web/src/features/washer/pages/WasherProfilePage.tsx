import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { WasherLayout } from '@/shared/components/layout/WasherLayout';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { Button } from '@/shared/components/ui/Button';
import { useAuth } from '@/shared/context/AuthContext';

const MOCK_WASHER = {
  firstName: 'James',
  lastName: 'K.',
  email: 'james@washflow.com',
  phone: '+1 555 0101',
  joinedAt: 'January 12, 2025',
};

export function WasherProfilePage() {
  const [editingField, setEditingField] = useState<'name' | 'phone' | 'email' | null>(null);
  const { logout } = useAuth();

  return (
    <WasherLayout>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
      </header>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Identity card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <ImagePlaceholder label="Profile photo" className="w-20 h-20 rounded-full mx-auto" />
          <p className="text-lg font-semibold text-gray-900 mt-3">
            {MOCK_WASHER.firstName} {MOCK_WASHER.lastName}
          </p>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full inline-block mt-1">
            Car Washer
          </span>
          <p className="text-xs text-gray-400 mt-2">Member since {MOCK_WASHER.joinedAt}</p>
        </div>

        {/* Editable info card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Account info</span>
          </div>

          {/* Name row */}
          <div className="px-4 py-3 border-b border-gray-100 last:border-b-0">
            {editingField === 'name' ? (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Name</span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  defaultValue={`${MOCK_WASHER.firstName} ${MOCK_WASHER.lastName}`}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
                    onClick={() => setEditingField(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                    onClick={() => { console.log('save name'); setEditingField(null); }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="text-sm text-gray-900 font-medium mt-0.5">
                    {MOCK_WASHER.firstName} {MOCK_WASHER.lastName}
                  </p>
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
          <div className="px-4 py-3 border-b border-gray-100 last:border-b-0">
            {editingField === 'phone' ? (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Phone</span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  defaultValue={MOCK_WASHER.phone}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
                    onClick={() => setEditingField(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                    onClick={() => { console.log('save phone'); setEditingField(null); }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-gray-900 font-medium mt-0.5">{MOCK_WASHER.phone}</p>
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

          {/* Email row */}
          <div className="px-4 py-3 border-b border-gray-100 last:border-b-0">
            {editingField === 'email' ? (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Email</span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  defaultValue={MOCK_WASHER.email}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
                    onClick={() => setEditingField(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                    onClick={() => { console.log('save email'); setEditingField(null); }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-gray-900 font-medium mt-0.5">{MOCK_WASHER.email}</p>
                </div>
                <button
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  onClick={() => setEditingField('email')}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Change password row */}
        <div className="bg-white rounded-xl border border-gray-200">
          <button
            className="w-full px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 rounded-xl"
            onClick={() => console.log('navigate to change password')}
          >
            <span className="text-sm font-medium text-gray-900">Change password</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Log out */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-red-500 border border-red-200 hover:bg-red-50"
          onClick={logout}
        >
          Log out
        </Button>
      </div>
    </WasherLayout>
  );
}
