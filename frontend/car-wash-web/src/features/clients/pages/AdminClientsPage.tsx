import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { EmptyState } from '@/shared/components/feedback/EmptyState';

export function AdminClientsPage() {
  const topBar = (
    <span className="text-lg font-semibold text-gray-900">Clients</span>
  );

  return (
    <AdminLayout topBar={topBar}>
      <div className="flex justify-center py-20">
        <EmptyState
          title="Clients"
          subtitle="Client management requires a dedicated API endpoint."
        />
      </div>
    </AdminLayout>
  );
}
