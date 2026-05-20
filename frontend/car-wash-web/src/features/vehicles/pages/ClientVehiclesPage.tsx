import { useState } from 'react';
import type { AxiosError } from 'axios';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Modal } from '@/shared/components/ui/Modal';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { ClientLayout } from '@/shared/components/layout/ClientLayout';
import type { VehicleResponse, VehicleRequest } from '../types';
import { useMyVehicles } from '../hooks/useMyVehicles';
import { useCreateVehicle } from '../hooks/useCreateVehicle';
import { useUpdateVehicle } from '../hooks/useUpdateVehicle';
import { useDeleteVehicle } from '../hooks/useDeleteVehicle';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function extractMessage(error: unknown): string {
  const err = error as AxiosError<{ message?: string }>;
  return err?.response?.data?.message ?? 'Could not save vehicle.';
}

// ─── SkeletonCard ──────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="bg-gray-100 h-32 w-full" />
      <div className="p-4 space-y-2">
        <div className="bg-gray-100 h-4 rounded w-3/4" />
        <div className="bg-gray-100 h-3 rounded w-1/2" />
      </div>
    </div>
  );
}

// ─── VehicleModal ──────────────────────────────────────────────────────────────

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleResponse | null;
  onSave: (data: VehicleRequest) => void;
  isSaving: boolean;
  saveError?: string | null;
}

function VehicleModal({ isOpen, onClose, vehicle, onSave, isSaving, saveError }: VehicleModalProps) {
  const [brand, setBrand] = useState(vehicle?.brand ?? '');
  const [model, setModel] = useState(vehicle?.model ?? '');
  const [licensePlate, setLicensePlate] = useState(vehicle?.licensePlate ?? '');
  const [type, setType] = useState<VehicleResponse['type'] | ''>(vehicle?.type ?? '');

  function handleSave() {
    if (!brand || !model || !licensePlate || !type) return;
    onSave({ brand, model, licensePlate, type });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle ? 'Edit vehicle' : 'Add vehicle'}
      size="md"
      closeOnBackdropClick={false}
    >
      <form onSubmit={e => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Brand"
            required
            placeholder="e.g. Toyota"
            value={brand}
            onChange={e => setBrand(e.target.value)}
          />
          <Input
            label="Model"
            required
            placeholder="e.g. Camry"
            value={model}
            onChange={e => setModel(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <Input
            label="Plate number"
            required
            placeholder="e.g. ABC-1234"
            value={licensePlate}
            onChange={e => setLicensePlate(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <Select
            label="Vehicle type"
            required
            value={type}
            onChange={e => setType(e.target.value as VehicleResponse['type'])}
          >
            <option value="">Select type</option>
            <option value="SEDAN">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="TRUCK">Truck</option>
            <option value="VAN">Van</option>
            <option value="MOTORCYCLE">Motorcycle</option>
            <option value="COUPE">Coupe</option>
          </Select>
        </div>
        {saveError && (
          <p className="text-sm text-red-600 mt-2">{saveError}</p>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="button"
            isLoading={isSaving}
            onClick={handleSave}
          >
            Save vehicle
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── VehicleCard ──────────────────────────────────────────────────────────────

interface VehicleCardProps {
  vehicle: VehicleResponse;
  onEdit: (vehicle: VehicleResponse) => void;
  onDelete: (id: string) => void;
}

function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <ImagePlaceholder label="Vehicle photo" aspectRatio="video" className="w-full" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <p className="text-base font-semibold text-gray-900">
            {vehicle.brand} {vehicle.model}
          </p>
          <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
            {vehicle.type}
          </span>
        </div>
        <p className="font-mono text-sm text-gray-700 mt-1">{vehicle.licensePlate}</p>
        <div className="flex gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={() => onEdit(vehicle)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(vehicle.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── AddVehicleGhostCard ──────────────────────────────────────────────────────

interface AddVehicleGhostCardProps {
  onClick: () => void;
}

function AddVehicleGhostCard({ onClick }: AddVehicleGhostCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-dashed border-gray-300 min-h-[200px] w-full flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <Plus className="w-8 h-8 text-gray-400" />
      <span className="text-sm text-gray-500 mt-2">Add vehicle</span>
    </button>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

interface ModalState {
  isOpen: boolean;
  vehicle: VehicleResponse | null;
}

export function ClientVehiclesPage() {
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, vehicle: null });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: vehicles, isLoading, isError } = useMyVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const isSaving = createVehicle.isPending || updateVehicle.isPending;
  const rawSaveError = createVehicle.error ?? updateVehicle.error;
  const saveError = rawSaveError ? extractMessage(rawSaveError) : null;

  function openAddModal() {
    setModalState({ isOpen: true, vehicle: null });
  }

  function openEditModal(vehicle: VehicleResponse) {
    setModalState({ isOpen: true, vehicle });
  }

  function closeModal() {
    setModalState({ isOpen: false, vehicle: null });
  }

  function handleSave(data: VehicleRequest) {
    if (modalState.vehicle) {
      updateVehicle.mutate(
        { id: modalState.vehicle.id, data },
        { onSuccess: () => setModalState({ isOpen: false, vehicle: null }) },
      );
    } else {
      createVehicle.mutate(data, {
        onSuccess: () => setModalState({ isOpen: false, vehicle: null }),
      });
    }
  }

  function renderContent() {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="py-16 flex justify-center">
          <ErrorState message="Could not load your vehicles." />
        </div>
      );
    }

    if (!vehicles || vehicles.length === 0) {
      return (
        <div className="py-16">
          <EmptyState
            title="No vehicles yet"
            subtitle="Add your first vehicle to start booking."
            action={{ label: '+ Add vehicle', onClick: openAddModal }}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(vehicle => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={openEditModal}
            onDelete={id => setDeletingId(id)}
          />
        ))}
        <AddVehicleGhostCard onClick={openAddModal} />
      </div>
    );
  }

  return (
    <ClientLayout>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Vehicles</h1>
          <Button variant="primary" size="sm" onClick={openAddModal}>
            + Add vehicle
          </Button>
        </div>

        {renderContent()}
      </main>

      <VehicleModal
        key={modalState.vehicle?.id ?? 'new'}
        isOpen={modalState.isOpen}
        onClose={closeModal}
        vehicle={modalState.vehicle}
        onSave={handleSave}
        isSaving={isSaving}
        saveError={saveError}
      />

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          deleteVehicle.mutate(deletingId!, {
            onSuccess: () => setDeletingId(null),
          });
        }}
        title="Delete vehicle"
        message="This vehicle will be removed. Bookings that used this vehicle will not be affected."
        confirmLabel="Delete vehicle"
        variant="danger"
        isLoading={deleteVehicle.isPending}
      />
    </ClientLayout>
  );
}
