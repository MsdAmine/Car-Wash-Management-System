import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { useAllEmployees } from '@/features/staff/hooks/useAllEmployees';
import { useAssignWasher } from '@/features/admin/hooks/useAssignWasher';

interface AssignJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    ref: string;
    service: string;
    datetime: string;
  } | null;
  bookingId: string | null;
}

export function AssignJobModal({ isOpen, onClose, booking, bookingId }: AssignJobModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: employees, isLoading: employeesLoading } = useAllEmployees();
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
        <div className="py-6">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(employees ?? []).map((employee) => {
            const isAvailable = employee.status === 'ACTIVE';
            const isSelected = selectedId === employee.id;

            const rowClass = !isAvailable
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
              : isSelected
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-gray-300';

            return (
              <div
                key={employee.id}
                role={isAvailable ? 'radio' : undefined}
                aria-checked={isAvailable ? isSelected : undefined}
                tabIndex={isAvailable ? 0 : undefined}
                className={`border-2 rounded-xl p-4 ${rowClass} ${isAvailable ? 'cursor-pointer' : ''}`}
                onClick={() => { if (isAvailable) setSelectedId(employee.id); }}
                onKeyDown={(e) => {
                  if (isAvailable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setSelectedId(employee.id);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <ImagePlaceholder label="Avatar" className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{employee.position}</p>
                  </div>
                  <div>
                    {isAvailable ? (
                      isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Available
                        </span>
                      )
                    ) : (
                      <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {employee.status === 'PENDING' ? 'Pending' : 'Inactive'}
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
