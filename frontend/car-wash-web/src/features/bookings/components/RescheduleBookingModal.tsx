import { useState, useEffect } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useRescheduleBooking } from '../hooks/useRescheduleBooking';

type RescheduleMutation = {
  mutate: (args: { id: string; appointmentDateTime: string }, options?: { onSuccess?: () => void }) => void;
  isPending: boolean;
  isError: boolean;
  error: unknown;
};

interface RescheduleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  washServiceId: string;
  rescheduleMutation?: RescheduleMutation;
}

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none';

export function RescheduleBookingModal({
  isOpen,
  onClose,
  bookingId,
  washServiceId,
  rescheduleMutation,
}: RescheduleBookingModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlots(
    date || null,
    washServiceId || null,
  );

  const internalMutation = useRescheduleBooking();
  const reschedule = rescheduleMutation ?? internalMutation;

  useEffect(() => {
    if (isOpen) {
      setDate('');
      setTime('');
    }
  }, [isOpen]);

  useEffect(() => { setTime(''); }, [date]);

  const today = new Date().toISOString().split('T')[0];
  const canSubmit = date !== '' && time !== '';
  const slots = slotsData?.slots ?? [];

  function handleSubmit() {
    if (!canSubmit) return;
    reschedule.mutate(
      { id: bookingId, appointmentDateTime: `${date}T${time}:00` },
      { onSuccess: onClose },
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reschedule booking" size="md" closeOnBackdropClick={false}>
      <div className="flex flex-col gap-5">

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">New Date</label>
          <input
            type="date"
            className={inputCls}
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {date && (
          <div>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Time Slot</p>
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

        {reschedule.isError && (
          <p className="text-sm text-red-600">
            {(reschedule.error as Error)?.message ?? 'Failed to reschedule. Please try again.'}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            size="sm"
            disabled={!canSubmit}
            isLoading={reschedule.isPending}
            onClick={handleSubmit}
          >
            Confirm reschedule
          </Button>
        </div>
      </div>
    </Modal>
  );
}
