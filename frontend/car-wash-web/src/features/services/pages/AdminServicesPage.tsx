import { useState, useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { ToggleSwitch } from '@/shared/components/ui/ToggleSwitch';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { useAllServices } from '../hooks/useAllServices';
import { useCreateService } from '../hooks/useCreateService';
import { useUpdateService } from '../hooks/useUpdateService';
import type { WashServiceResponse, WashServiceRequest } from '../types';
import { getServiceImage } from '../serviceImages';

// ─── Slide-over panel ─────────────────────────────────────────────────────────

interface ServicePanelProps {
  isOpen: boolean;
  onClose: () => void;
  service: WashServiceResponse | null;
}

function ServicePanel({ isOpen, onClose, service }: ServicePanelProps) {
  const createService  = useCreateService();
  const updateService  = useUpdateService();
  const imageInputRef  = useRef<HTMLInputElement>(null);

  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration]       = useState('');
  const [price, setPrice]             = useState('');
  const [active, setActive]           = useState(true);
  const [imageSrc, setImageSrc]       = useState('');

  useEffect(() => {
    setName(service?.name ?? '');
    setDescription(service?.description ?? '');
    setDuration(service ? String(service.durationMinutes) : '');
    setPrice(service ? String(service.price) : '');
    setActive(service?.active ?? true);
    setImageSrc(service?.imageUrl ?? '');
  }, [service, isOpen]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageSrc(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const isSaving = createService.isPending || updateService.isPending;

  function handleSave() {
    const body: WashServiceRequest = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      durationMinutes: parseInt(duration, 10),
      active,
      imageUrl: imageSrc || null,
    };

    if (service) {
      updateService.mutate({ id: service.id, data: body }, { onSuccess: onClose });
    } else {
      createService.mutate(body, { onSuccess: onClose });
    }
  }

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
            <img
              src={getServiceImage({ name, imageUrl: imageSrc || null })}
              alt="Service photo"
              className="w-full aspect-video object-cover rounded-lg"
            />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="mt-1.5 text-xs text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:underline"
            >
              Upload image
            </button>
          </div>

          <Input
            label="Service name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            label="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duration (min)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Input
              label="Price ($)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <ToggleSwitch
              checked={active}
              onChange={() => setActive((v) => !v)}
              label="Toggle service active state"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSave}>
            Save service
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Skeleton cards ───────────────────────────────────────────────────────────

function SkeletonCards() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="w-full aspect-video bg-gray-100" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminServicesPage() {
  const { data: services, isLoading, isError } = useAllServices();
  const updateService = useUpdateService();

  const [panelOpen, setPanelOpen]             = useState(false);
  const [editingService, setEditingService]   = useState<WashServiceResponse | null>(null);

  function openAdd() {
    setEditingService(null);
    setPanelOpen(true);
  }

  function openEdit(service: WashServiceResponse) {
    setEditingService(service);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
  }

  function toggleServiceActive(service: WashServiceResponse, active: boolean) {
    updateService.mutate({
      id: service.id,
      data: {
        name: service.name,
        description: service.description,
        price: service.price,
        durationMinutes: service.durationMinutes,
        active,
        imageUrl: service.imageUrl ?? null,
      },
    });
  }

  const topBar = (
    <>
      <span className="text-lg font-semibold text-gray-900">Services</span>
      <Button variant="primary" size="sm" onClick={openAdd}>+ Add service</Button>
    </>
  );

  if (isError) {
    return (
      <AdminLayout topBar={topBar}>
        <div className="flex justify-center py-20">
          <ErrorState message="Could not load services." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout topBar={topBar}>
      <div className="grid grid-cols-3 gap-4">
        {isLoading ? (
          <SkeletonCards />
        ) : (
          (services ?? []).map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-opacity ${
                service.active ? '' : 'opacity-60'
              }`}
            >
              <img
                src={getServiceImage(service)}
                alt={service.name}
                className="w-full aspect-video object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <span className="text-base font-semibold text-gray-900">{service.name}</span>
                  <ToggleSwitch
                    checked={service.active}
                    onChange={(checked) => toggleServiceActive(service, checked)}
                    label={service.active ? 'Deactivate service' : 'Activate service'}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                    {service.durationMinutes} min
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
          ))
        )}

        {/* Ghost add card */}
        {!isLoading && (
          <button
            type="button"
            onClick={openAdd}
            className="bg-white rounded-xl border-2 border-dashed border-gray-300 aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
          >
            <Plus className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500 mt-2">Add service</span>
          </button>
        )}
      </div>

      <ServicePanel isOpen={panelOpen} onClose={closePanel} service={editingService} />
    </AdminLayout>
  );
}
