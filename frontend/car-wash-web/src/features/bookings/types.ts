export interface TimeSlotResponse {
  time: string
  available: boolean
  reason: string | null
}

export interface AvailableSlotsResponse {
  date: string
  serviceId: string
  serviceName: string
  durationMinutes: number
  slots: TimeSlotResponse[]
}

export interface BookingRequest {
  vehicleId: string
  washServiceId: string
  appointmentDateTime: string
  notes?: string
}

export interface BookingResponse {
  id: string
  customerId: string
  customerEmail: string
  vehicleId: string
  vehicleLicensePlate: string
  washServiceId: string
  washServiceName: string
  washServicePrice: number
  durationMinutes: number
  totalPrice: number
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  appointmentDateTime: string
  endDateTime: string | null
  notes: string | null
  startedAt: string | null
  createdAt: string
  updatedAt: string
}
