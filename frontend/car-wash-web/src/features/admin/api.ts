import api from '@/shared/lib/axios'
import type { AdminDashboardResponse, AssignEmployeeRequest, BookingAssignmentResponse, RevenueDataPoint } from './types'
import type { BookingResponse } from '@/features/bookings/types'
import type { EmployeeResponse } from '@/features/staff/types'

export async function fetchAdminDashboard(): Promise<AdminDashboardResponse> {
  const { data } = await api.get<AdminDashboardResponse>('/dashboard/admin')
  return data
}

export async function fetchAllBookings(): Promise<BookingResponse[]> {
  const { data } = await api.get<BookingResponse[]>('/bookings')
  return data
}

export async function fetchBookingDetail(id: string): Promise<BookingResponse> {
  const { data } = await api.get<BookingResponse>(`/bookings/${id}`)
  return data
}

export async function assignWasher(
  bookingId: string,
  body: AssignEmployeeRequest,
): Promise<BookingAssignmentResponse> {
  const { data } = await api.post<BookingAssignmentResponse>(`/bookings/${bookingId}/assign`, body)
  return data
}

export async function fetchBookingAssignments(
  bookingId: string,
): Promise<BookingAssignmentResponse[]> {
  const { data } = await api.get<BookingAssignmentResponse[]>(`/bookings/${bookingId}/assignments`)
  return data
}

export async function cancelBooking(id: string): Promise<BookingResponse> {
  const { data } = await api.patch<BookingResponse>(`/bookings/${id}/cancel`)
  return data
}

export async function fetchRevenueTimeSeries(
  period: 'daily' | 'weekly' | 'monthly',
  days: number,
): Promise<RevenueDataPoint[]> {
  const { data } = await api.get<RevenueDataPoint[]>('/dashboard/revenue', {
    params: { period, days },
  })
  return data
}

export async function fetchAvailableEmployees(
  date: string,
  time: string,
  duration: number,
): Promise<EmployeeResponse[]> {
  const { data } = await api.get<EmployeeResponse[]>('/employees/available', {
    params: { date, time, duration },
  })
  return data
}
