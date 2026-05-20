import { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';

const MOCK_WASHERS = [
  { id: '1', name: 'James K.', jobsToday: 3, available: true },
  { id: '2', name: 'Maria L.', jobsToday: 2, available: true },
  { id: '3', name: 'Tony B.', jobsToday: 4, available: false },
  { id: '4', name: 'Priya S.', jobsToday: 1, available: true },
];

interface AssignJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (washerId: string) => void;
  booking: {
    ref: string;
    service: string;
    datetime: string;
  } | null;
}

export function AssignJobModal({ isOpen, onClose, onAssign, booking }: AssignJobModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedId(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!booking) return null;

  function handleAssign() {
    if (!selectedId) return;
    setIsLoading(true);
    timeoutRef.current = setTimeout(() => {
      onAssign(selectedId);
      onClose();
    }, 1000);
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
      <div className="flex flex-col gap-3">
        {MOCK_WASHERS.map(washer => {
          const isSelected = selectedId === washer.id;

          const rowClass = !washer.available
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
            : isSelected
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white hover:border-gray-300';

          return (
            <div
              key={washer.id}
              role={washer.available ? 'radio' : undefined}
              aria-checked={washer.available ? isSelected : undefined}
              tabIndex={washer.available ? 0 : undefined}
              className={`border-2 rounded-xl p-4 ${rowClass} ${washer.available ? 'cursor-pointer' : ''}`}
              onClick={() => { if (washer.available) setSelectedId(washer.id); }}
              onKeyDown={e => {
                if (washer.available && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  setSelectedId(washer.id);
                }
              }}
            >
              <div className="flex items-center gap-4">
                <ImagePlaceholder label="Avatar" className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{washer.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{washer.jobsToday} jobs today</p>
                </div>
                <div>
                  {washer.available ? (
                    isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        Available
                      </span>
                    )
                  ) : (
                    <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Busy
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={selectedId === null}
          isLoading={isLoading}
          onClick={handleAssign}
        >
          Assign washer
        </Button>
      </div>
    </Modal>
  );
}
