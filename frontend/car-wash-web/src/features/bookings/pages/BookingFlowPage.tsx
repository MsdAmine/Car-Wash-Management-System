import { useState } from 'react';
import { Car, CheckCircle2, Plus, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { StepTracker } from '@/shared/components/ui/StepTracker';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { ClientLayout } from '@/shared/components/layout/ClientLayout';
import { ROUTES } from '@/router/routes';
import { useActiveServices } from '@/features/services/hooks/useActiveServices';
import { useMyVehicles } from '@/features/vehicles/hooks/useMyVehicles';
import { useCreateBooking } from '../hooks/useCreateBooking';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import type { WashServiceResponse } from '@/features/services/types';
import type { VehicleResponse } from '@/features/vehicles/types';
import type { TimeSlotResponse } from '../types';

// ─── Step 0 — Service selection ──────────────────────────────────────────────

interface ServiceStepProps {
  services: WashServiceResponse[];
  selectedServiceId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
}

function ServiceStep({ services, selectedServiceId, onSelect, isLoading, isError }: ServiceStepProps) {
  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a service</h2>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a service</h2>
        <ErrorState message="Could not load services." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a service</h2>
      <div className="grid grid-cols-2 gap-4">
        {services.map(service => {
          const isSelected = selectedServiceId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.id)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(service.id)}
              className={`border-2 rounded-xl p-4 cursor-pointer w-full text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <ImagePlaceholder label={service.name} aspectRatio="video" className="w-full mb-3" />
              <p className="text-sm font-semibold text-gray-900">{service.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-gray-900">${service.price}</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {service.durationMinutes} min
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1 — Vehicle selection ──────────────────────────────────────────────

interface VehicleStepProps {
  vehicles: VehicleResponse[];
  selectedVehicleId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  onAddVehicle: () => void;
}

function VehicleStep({ vehicles, selectedVehicleId, onSelect, isLoading, onAddVehicle }: VehicleStepProps) {
  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a vehicle</h2>
        <div className="flex flex-col gap-3">
          {[0, 1].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a vehicle</h2>
      {vehicles.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 mb-3">You have no saved vehicles.</p>
          <Button variant="ghost" size="sm" onClick={onAddVehicle}>
            <Plus className="w-4 h-4" />
            Add a vehicle
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {vehicles.map(vehicle => {
            const isSelected = selectedVehicleId === vehicle.id;
            return (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => onSelect(vehicle.id)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(vehicle.id)}
                className={`border-2 rounded-xl p-4 cursor-pointer flex items-center gap-4 w-full text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Car className={`w-8 h-8 flex-shrink-0 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{vehicle.licensePlate}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {vehicle.type}
                    </span>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Step 2 — Date & time ────────────────────────────────────────────────────

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface DateTimeStepProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  slots: TimeSlotResponse[] | undefined;
  slotsLoading: boolean;
  slotsError: boolean;
}

function DateTimeStep({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  slots,
  slotsLoading,
  slotsError,
}: DateTimeStepProps) {
  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabel = displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const isPastDay = (day: number) => new Date(year, month, day) < today;

  const isSelectedDay = (day: number) =>
    selectedDate !== null &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() === month &&
    selectedDate.getDate() === day;

  const handleDateClick = (day: number) => {
    onSelectDate(new Date(year, month, day));
  };

  const isTodayDay = (day: number) => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Pick a date and time</h2>

      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setDisplayMonth(new Date(year, month - 1, 1))}
          className="p-1 rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-gray-900">{monthLabel}</span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setDisplayMonth(new Date(year, month + 1, 1))}
          className="p-1 rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map(d => (
          <span key={d} className="text-xs text-gray-500 text-center">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const past = isPastDay(day);
          const selected = isSelectedDay(day);
          const isToday = isTodayDay(day);

          let cls =
            'w-full aspect-square flex items-center justify-center text-sm rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ';

          if (selected) {
            cls += 'bg-indigo-600 text-white';
          } else if (past) {
            cls += 'text-gray-300 cursor-not-allowed';
          } else {
            cls += `hover:bg-gray-100 cursor-pointer ${isToday ? 'font-semibold text-gray-900' : 'text-gray-700'}`;
          }

          return (
            <button
              key={day}
              type="button"
              disabled={past}
              onClick={() => handleDateClick(day)}
              className={cls}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div>
          <p className="text-sm font-medium text-gray-700 mt-6 mb-3">Available times</p>

          {slotsLoading && (
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 rounded-lg h-9 animate-pulse" />
              ))}
            </div>
          )}

          {!slotsLoading && slotsError && (
            <p className="text-sm text-red-500 mt-4">Could not load available time slots.</p>
          )}

          {!slotsLoading && !slotsError && slots && slots.length === 0 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              No time slots available for this date.
            </p>
          )}

          {!slotsLoading && !slotsError && slots && slots.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {slots.map(slot => {
                if (!slot.available) {
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled
                      title={slot.reason ?? 'Unavailable'}
                      className="bg-gray-50 border border-gray-200 rounded-lg py-2 text-xs text-gray-300 line-through cursor-not-allowed"
                    >
                      {slot.time}
                    </button>
                  );
                }

                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => onSelectTime(slot.time)}
                    className={`rounded-lg py-2 text-xs border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      selectedTime === slot.time
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white border-gray-200 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step 3 — Confirm ────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatDate(date: Date): string {
  return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

interface ConfirmStepProps {
  service: WashServiceResponse;
  vehicle: VehicleResponse;
  date: Date;
  timeSlot: string;
}

function ConfirmStep({ service, vehicle, date, timeSlot }: ConfirmStepProps) {
  const rows = [
    { label: 'Service', value: service.name },
    { label: 'Vehicle', value: `${vehicle.brand} ${vehicle.model}` },
    { label: 'Date', value: formatDate(date) },
    { label: 'Time', value: timeSlot },
  ];

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm your booking</h2>
      <div className="bg-gray-50 rounded-xl p-4">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex justify-between py-2 ${i < rows.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <span className="text-sm text-gray-500">{row.label}</span>
            <span className="text-sm text-gray-900 font-medium">{row.value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-3 mt-1">
          <span className="text-sm font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-indigo-600">${service.price}</span>
        </div>
      </div>
      <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mt-4">
        <Info className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-green-700">
          Free cancellation up to 24 hours before your appointment.
        </p>
      </div>
    </div>
  );
}

// ─── Success state ───────────────────────────────────────────────────────────

interface SuccessCardProps {
  bookingRef: string;
}

function SuccessCard({ bookingRef }: SuccessCardProps) {
  const navigate = useNavigate();
  return (
    <div className="p-8 text-center">
      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
      <h2 className="text-xl font-semibold text-gray-900 mt-4">You're all set!</h2>
      <p className="text-sm text-gray-500 mt-1">Your booking has been confirmed.</p>
      <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg inline-block mt-3">
        {bookingRef}
      </span>
      <div className="mt-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.CLIENT.BOOKINGS)}>
          View my bookings
        </Button>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Service' },
  { label: 'Vehicle' },
  { label: 'Date & Time' },
  { label: 'Confirm' },
];

export function BookingFlowPage() {
  const navigate = useNavigate();

  const { data: services = [], isLoading: servicesLoading, isError: servicesError } = useActiveServices();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useMyVehicles();
  const createBooking = useCreateBooking();

  const [currentStep, setCurrentStep] = useState(0);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const selectedService = services.find(s => s.id === selectedServiceId);
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  const selectedDateIso = selectedDate
    ? selectedDate.toISOString().split('T')[0]
    : null;

  const {
    data: slotsData,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useAvailableSlots(selectedDateIso, selectedService?.id ?? null);

  const canContinue =
    (currentStep === 0 && selectedServiceId !== null) ||
    (currentStep === 1 && selectedVehicleId !== null) ||
    (currentStep === 2 && selectedDate !== null && selectedTimeSlot !== null) ||
    currentStep === 3;

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(s => s + 1);
      return;
    }

    if (!selectedService || !selectedVehicle || !selectedDate || !selectedTimeSlot) return;

    const [hours = '0', minutes = '0'] = selectedTimeSlot.split(':');
    const dt = new Date(selectedDate);
    dt.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const appointmentDateTime = dt.toISOString();

    createBooking.mutate(
      { vehicleId: selectedVehicle.id, washServiceId: selectedService.id, appointmentDateTime },
      { onSuccess: data => setConfirmedBookingId(data.id) },
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ServiceStep
            services={services}
            selectedServiceId={selectedServiceId}
            onSelect={setSelectedServiceId}
            isLoading={servicesLoading}
            isError={servicesError}
          />
        );
      case 1:
        return (
          <VehicleStep
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onSelect={setSelectedVehicleId}
            isLoading={vehiclesLoading}
            onAddVehicle={() => navigate(ROUTES.CLIENT.VEHICLES)}
          />
        );
      case 2:
        return (
          <DateTimeStep
            selectedDate={selectedDate}
            onSelectDate={date => {
              setSelectedDate(date);
              setSelectedTimeSlot(null);
            }}
            selectedTime={selectedTimeSlot}
            onSelectTime={setSelectedTimeSlot}
            slots={slotsData?.slots}
            slotsLoading={slotsLoading}
            slotsError={slotsError}
          />
        );
      case 3:
        if (selectedService && selectedVehicle && selectedDate && selectedTimeSlot) {
          return (
            <ConfirmStep
              service={selectedService}
              vehicle={selectedVehicle}
              date={selectedDate}
              timeSlot={selectedTimeSlot}
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <ClientLayout>
      <main className="max-w-lg mx-auto py-10 px-4">
        {confirmedBookingId === null && <StepTracker steps={STEPS} currentStep={currentStep} />}

        <div className="bg-white rounded-xl border border-gray-200 mt-6">
          {confirmedBookingId !== null ? (
            <SuccessCard bookingRef={confirmedBookingId.slice(-8).toUpperCase()} />
          ) : (
            <>
              {renderStep()}

              <div className="border-t border-gray-200 px-6 py-4 flex flex-col gap-3">
                {currentStep === 3 && createBooking.isError && (
                  <p className="text-sm text-red-600 text-right">
                    {createBooking.error?.message ?? 'Failed to create booking. Please try again.'}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  {currentStep > 0 ? (
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(s => s - 1)}>
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!canContinue}
                    isLoading={currentStep === 3 ? createBooking.isPending : false}
                    onClick={handleContinue}
                  >
                    {currentStep === 3 ? 'Confirm booking' : 'Continue'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </ClientLayout>
  );
}
