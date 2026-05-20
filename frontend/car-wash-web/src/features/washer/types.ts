export type { BookingResponse } from '@/features/bookings/types'

export interface BookingAssignmentResponse {
  id: string
  bookingId: string
  employeeId: string
  employeeFirstName: string
  employeeLastName: string
  employeePosition: string
  assignedByUserId: string
  assignedByEmail: string
  assignedAt: string
}

export interface UpdateStatusRequest {
  status: 'IN_PROGRESS' | 'COMPLETED'
}
