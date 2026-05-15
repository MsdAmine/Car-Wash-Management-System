import React from 'react';

const AdminSettings: React.FC = () => {
    return (
        <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-950">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Admin settings will live here as the system grows.
                </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-950">Workspace preferences</h2>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                            This placeholder keeps the admin route available without introducing new settings behavior.
                        </p>
                    </div>
                    <span className="inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                        Coming soon
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
