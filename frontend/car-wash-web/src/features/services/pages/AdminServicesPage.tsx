import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { ToggleSwitch } from '@/shared/components/ui/ToggleSwitch';

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_SERVICES = [
  { id: '1', name: 'Basic Wash', description: 'Exterior hand wash and dry.', duration: 30, price: 15, isActive: true },
  { id: '2', name: 'Full Detail', description: 'Interior + exterior full detail.', duration: 90, price: 65, isActive: true },
  { id: '3', name: 'Express Wash', description: 'Quick exterior rinse and dry.', duration: 20, price: 10, isActive: true },
  { id: '4', name: 'Premium Detail', description: 'Full detail + paint protection.', duration: 120, price: 95, isActive: false },
];

// ─── Slide-over panel ─────────────────────────────────────────────────────────

interface ServicePanelProps {
  isOpen: boolean;
  onClose: () => void;
  service: (typeof MOCK_SERVICES)[0] | null;
}

function ServicePanel({ isOpen, onClose, service }: ServicePanelProps) {
  const [panelActive, setPanelActive] = useState(service?.isActive ?? true);

  useEffect(() => {
    setPanelActive(service?.isActive ?? true);
  }, [service]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {service ? 'Edit service' : 'Add service'}
          </h2>
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-4 overflow-y-auto flex-1">
          <div>
            <ImagePlaceholder label="Service photo" aspectRatio="video" className="w-full" />
            <p className="text-xs text-gray-400 mt-1">Image upload coming soon.</p>
          </div>

          <Input
            label="Service name"
            required
            defaultValue={service?.name ?? ''}
            onChange={(e) => console.log('name:', e.target.value)}
          />

          <Textarea
            label="Description"
            rows={3}
            defaultValue={service?.description ?? ''}
            onChange={(e) => console.log('description:', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duration (min)"
              type="number"
              defaultValue={service?.duration ?? ''}
              onChange={(e) => console.log('duration:', e.target.value)}
            />
            <Input
              label="Price ($)"
              type="number"
              defaultValue={service?.price ?? ''}
              onChange={(e) => console.log('price:', e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <ToggleSwitch
              checked={panelActive}
              onChange={() => setPanelActive((v) => !v)}
              label="Toggle service active state"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => console.log('save service')}>
            Save service
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminServicesPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingService, setEditingService] = useState<(typeof MOCK_SERVICES)[0] | null>(null);
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>(
    () => Object.fromEntries(MOCK_SERVICES.map((s) => [s.id, s.isActive]))
  );

  function openAdd() {
    setEditingService(null);
    setPanelOpen(true);
  }

  function openEdit(service: (typeof MOCK_SERVICES)[0]) {
    setEditingService(service);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
  }

  function toggleActive(id: string) {
    setActiveStates((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const topBar = (
    <>
      <span className="text-lg font-semibold text-gray-900">Services</span>
      <Button variant="primary" size="sm" onClick={openAdd}>+ Add service</Button>
    </>
  );

  return (
    <AdminLayout topBar={topBar}>
      <div className="grid grid-cols-3 gap-4">
        {MOCK_SERVICES.map((service) => {
          const isActive = activeStates[service.id];
          return (
            <div
              key={service.id}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-opacity ${
                isActive ? '' : 'opacity-60'
              }`}
            >
              <ImagePlaceholder label={service.name} aspectRatio="video" className="w-full" />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <span className="text-base font-semibold text-gray-900">{service.name}</span>
                  <ToggleSwitch
                    checked={isActive}
                    onChange={() => toggleActive(service.id)}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                    {service.duration} min
                  </span>
                  <span className="text-base font-bold text-gray-900 ml-auto">
                    ${service.price}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => openEdit(service)}
                >
                  Edit
                </Button>
              </div>
            </div>
          );
        })}

        {/* Ghost add card */}
        <button
          type="button"
          onClick={openAdd}
          className="bg-white rounded-xl border-2 border-dashed border-gray-300 aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
        >
          <Plus className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-500 mt-2">Add service</span>
        </button>
      </div>

      <ServicePanel isOpen={panelOpen} onClose={closePanel} service={editingService} />
    </AdminLayout>
  );
}
