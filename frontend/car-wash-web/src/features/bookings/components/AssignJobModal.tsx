import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { useAvailableEmployees } from '@/features/admin/hooks/useAvailableEmployees';
import { useAssignWasher } from '@/features/admin/hooks/useAssignWasher';

interface AssignJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    ref: string;
    service: string;
    datetime: string;
    appointmentDateTime: string;
    durationMinutes: number;
  } | null;
  bookingId: string | null;
}

function parseDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toISOString().slice(0, 10);
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return { date, time };
}

export function AssignJobModal({ isOpen, onClose, booking, bookingId }: AssignJobModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const parsed = booking ? parseDateTime(booking.appointmentDateTime) : { date: '', time: '' };
  const duration = booking?.durationMinutes ?? 0;

  const {
    data: employees,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useAvailableEmployees(parsed.date, parsed.time, duration, isOpen);

  const assignWasher = useAssignWasher();

  useEffect(() => {
    if (isOpen) {
      setSelectedId(null);
    }
  }, [isOpen]);

  if (!booking) return null;

  function handleAssign() {
    if (!selectedId || !bookingId) return;
    assignWasher.mutate(
      { bookingId, employeeId: selectedId },
      { onSuccess: onClose },
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign washer" size="lg" closeOnBackdropClick={false}>
      {/* Booking summary strip */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Booking ref</p>
            <p className="text-sm font-semibold font-mono text-gray-900 mt-1">{booking.ref}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Service</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{booking.service}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date &amp; time</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{booking.datetime}</p>
          </div>
        </div>
      </div>

      {/* Section label */}
      <p className="text-sm font-medium text-gray-700 mb-3">Select a washer</p>

      {/* Washer list */}
      {employeesLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : employeesError ? (
        <div className="py-6">
          <ErrorState message="Could not load available washers." />
        </div>
      ) : !employees || employees.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No washers available for this time slot.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {employees.map((employee) => {
            const isSelected = selectedId === employee.id;
            return (
              <div
                key={employee.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`border-2 rounded-xl p-4 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedId(employee.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(employee.id);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <img src="/images/avatar-washer.png" alt="Avatar" className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{employee.position}</p>
                  </div>
                  <div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={selectedId === null}
          isLoading={assignWasher.isPending}
          onClick={handleAssign}
        >
          Assign washer
        </Button>
      </div>
    </Modal>
  );
}
