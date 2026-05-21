import { useState, useEffect } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { useAllClients } from '@/features/clients/hooks/useAllClients';
import { useVehiclesByCustomer } from '@/features/vehicles/hooks/useVehiclesByCustomer';
import { useActiveServices } from '@/features/services/hooks/useActiveServices';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useAdminCreateBooking } from '@/features/admin/hooks/useAdminCreateBooking';

interface AdminNewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const selectCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed';

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

export function AdminNewBookingModal({ isOpen, onClose }: AdminNewBookingModalProps) {
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [vehicleId, setVehicleId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const { data: clients = [], isLoading: clientsLoading } = useAllClients();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehiclesByCustomer(customerId, !!customerId);
  const { data: services = [], isLoading: servicesLoading } = useActiveServices();
  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlots(
    date || null,
    serviceId || null,
  );

  const createBooking = useAdminCreateBooking();

  useEffect(() => { setVehicleId(''); }, [customerId]);
  useEffect(() => { setTime(''); }, [date, serviceId]);

  useEffect(() => {
    if (isOpen) {
      setCustomerId(null);
      setVehicleId('');
      setServiceId('');
      setDate('');
      setTime('');
    }
  }, [isOpen]);

  const today = new Date().toISOString().split('T')[0];
  const canSubmit = customerId !== null && vehicleId !== '' && serviceId !== '' && date !== '' && time !== '';

  function handleSubmit() {
    if (!canSubmit) return;
    createBooking.mutate(
      { customerId: customerId!, vehicleId, washServiceId: serviceId, appointmentDateTime: `${date}T${time}:00` },
      { onSuccess: onClose },
    );
  }

  const slots = slotsData?.slots ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New booking" size="xl" closeOnBackdropClick={false}>
      <div className="flex flex-col gap-5">

        {/* Customer & Vehicle */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Customer">
            <select
              className={selectCls}
              value={customerId ?? ''}
              onChange={(e) => setCustomerId(e.target.value ? Number(e.target.value) : null)}
              disabled={clientsLoading}
            >
              <option value="">Select customer…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} · {c.email}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Vehicle">
            <select
              className={selectCls}
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              disabled={!customerId || vehiclesLoading}
            >
              <option value="">
                {!customerId ? 'Select customer first' : vehicles.length === 0 ? 'No vehicles' : 'Select vehicle…'}
              </option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} · {v.licensePlate}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Service */}
        <Field label="Service">
          <select
            className={selectCls}
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            disabled={servicesLoading}
          >
            <option value="">Select service…</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — ${s.price} ({s.durationMinutes} min)
              </option>
            ))}
          </select>
        </Field>

        {/* Date */}
        <Field label="Date">
          <input
            type="date"
            className={selectCls}
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>

        {/* Time slots */}
        {date && serviceId && (
          <div>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Time slot</p>
            {slotsLoading ? (
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-2">No slots available for this date.</p>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    title={slot.available ? undefined : (slot.reason ?? 'Unavailable')}
                    onClick={() => setTime(slot.time)}
                    className={`rounded-lg py-2 text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      !slot.available
                        ? 'bg-gray-50 border-gray-200 text-gray-300 line-through cursor-not-allowed'
                        : time === slot.time
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white border-gray-200 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {createBooking.isError && (
          <p className="text-sm text-red-600">
            {(createBooking.error as Error)?.message ?? 'Failed to create booking. Please try again.'}
          </p>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!canSubmit}
            isLoading={createBooking.isPending}
            onClick={handleSubmit}
          >
            Create booking
          </Button>
        </div>
      </div>
    </Modal>
  );
}
