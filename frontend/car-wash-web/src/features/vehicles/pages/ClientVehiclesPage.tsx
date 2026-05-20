import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Modal } from '@/shared/components/ui/Modal';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ClientLayout } from '@/shared/components/layout/ClientLayout';

// ─── Mock data (not exported) ──────────────────────────────────────────────────

const MOCK_VEHICLES = [
  { id: '1', make: 'Toyota', model: 'Camry',  year: 2019, plate: 'ABC-1234', type: 'Sedan',  colour: 'Silver' },
  { id: '2', make: 'Ford',   model: 'F-150',  year: 2021, plate: 'XYZ-9876', type: 'Truck',  colour: 'Black' },
  { id: '3', make: 'Honda',  model: 'Civic',  year: 2022, plate: 'DEF-5678', type: 'Sedan',  colour: 'White' },
];

// ─── Types ─────────────────────────────────────────────────────────────────────

type MockVehicle = (typeof MOCK_VEHICLES)[0];

// ─── VehicleModal ──────────────────────────────────────────────────────────────

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: MockVehicle | null;
}

function VehicleModal({ isOpen, onClose, vehicle }: VehicleModalProps) {
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
            label="Make"
            required
            placeholder="e.g. Toyota"
            defaultValue={vehicle?.make ?? ''}
          />
          <Input
            label="Model"
            required
            placeholder="e.g. Camry"
            defaultValue={vehicle?.model ?? ''}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Input
            label="Year"
            type="number"
            placeholder="e.g. 2022"
            defaultValue={vehicle?.year ?? ''}
          />
          <Input
            label="Colour"
            placeholder="e.g. Silver"
            defaultValue={vehicle?.colour ?? ''}
          />
        </div>
        <div className="mt-3">
          <Input
            label="Plate number"
            required
            placeholder="e.g. ABC-1234"
            defaultValue={vehicle?.plate ?? ''}
          />
        </div>
        <div className="mt-3">
          <Select
            label="Vehicle type"
            required
            defaultValue={vehicle?.type ?? ''}
          >
            <option value="">Select type</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Van">Van</option>
            <option value="Other">Other</option>
          </Select>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="button"
            onClick={() => console.log('save vehicle')}
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
  vehicle: MockVehicle;
  onEdit: (vehicle: MockVehicle) => void;
  onDelete: (id: string) => void;
}

function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <ImagePlaceholder label="Vehicle photo" aspectRatio="video" className="w-full" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <p className="text-base font-semibold text-gray-900">
            {vehicle.make} {vehicle.model}
          </p>
          <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
            {vehicle.type}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {vehicle.year} · {vehicle.colour}
        </p>
        <p className="font-mono text-sm text-gray-700 mt-1">{vehicle.plate}</p>
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

export function ClientVehiclesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<MockVehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openAddModal() {
    setEditingVehicle(null);
    setModalOpen(true);
  }

  function openEditModal(vehicle: MockVehicle) {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
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

        {MOCK_VEHICLES.length === 0 ? (
          <div className="py-16">
            <EmptyState
              title="No vehicles yet"
              subtitle="Add your first vehicle to start booking."
              action={{ label: '+ Add vehicle', onClick: openAddModal }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_VEHICLES.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={openEditModal}
                onDelete={id => setDeletingId(id)}
              />
            ))}
            <AddVehicleGhostCard onClick={openAddModal} />
          </div>
        )}
      </main>

      <VehicleModal
        isOpen={modalOpen}
        onClose={closeModal}
        vehicle={editingVehicle}
      />

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          console.log('delete', deletingId);
          setDeletingId(null);
        }}
        title="Delete vehicle"
        message="This vehicle will be removed. Bookings that used this vehicle will not be affected."
        confirmLabel="Delete vehicle"
        variant="danger"
      />
    </ClientLayout>
  );
}
