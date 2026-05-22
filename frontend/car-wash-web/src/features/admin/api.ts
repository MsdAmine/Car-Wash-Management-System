import api from '@/shared/lib/axios'
import type {
  AdminBookingRequest,
  AdminDashboardResponse,
  AssignEmployeeRequest,
  BookingAssignmentResponse,
  BusinessSettingsRequest,
  BusinessSettingsResponse,
  HeatmapResponse,
  OperatingHoursResponse,
  RescheduleBookingRequest,
  RevenueDataPoint,
  ServiceBookingStatResponse,
  UpdateOperatingHoursRequest,
} from './types'
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
  from?: string,
  to?: string,
): Promise<RevenueDataPoint[]> {
  const { data } = await api.get<RevenueDataPoint[]>('/dashboard/revenue', {
    params: { period, days, ...(from && { from }), ...(to && { to }) },
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

export async function fetchBusinessSettings(): Promise<BusinessSettingsResponse> {
  const { data } = await api.get<BusinessSettingsResponse>('/settings/business')
  return data
}

export async function updateBusinessSettings(
  body: BusinessSettingsRequest,
): Promise<BusinessSettingsResponse> {
  const { data } = await api.put<BusinessSettingsResponse>('/settings/business', body)
  return data
}

export async function fetchOperatingHours(): Promise<OperatingHoursResponse[]> {
  const { data } = await api.get<OperatingHoursResponse[]>('/settings/hours')
  return data
}

export async function updateOperatingHours(
  body: UpdateOperatingHoursRequest,
): Promise<OperatingHoursResponse[]> {
  const { data } = await api.put<OperatingHoursResponse[]>('/settings/hours', body)
  return data
}

export async function fetchBookingsByService(from?: string, to?: string): Promise<ServiceBookingStatResponse[]> {
  const { data } = await api.get<ServiceBookingStatResponse[]>('/dashboard/bookings-by-service', {
    params: { ...(from && { from }), ...(to && { to }) },
  })
  return data
}

export async function adminCreateBooking(body: AdminBookingRequest): Promise<BookingResponse> {
  const { data } = await api.post<BookingResponse>('/admin/bookings', body)
  return data
}

export async function fetchActivityHeatmap(from?: string, to?: string): Promise<HeatmapResponse> {
  const { data } = await api.get<HeatmapResponse>('/dashboard/activity-heatmap', {
    params: { ...(from && { from }), ...(to && { to }) },
  })
  return data
}

export async function adminCancelBooking(id: string): Promise<BookingResponse> {
  const { data } = await api.patch<BookingResponse>(`/bookings/${id}/status`, { status: 'CANCELLED' })
  return data
}

export async function rescheduleBooking(id: string, body: RescheduleBookingRequest): Promise<BookingResponse> {
  const { data } = await api.patch<BookingResponse>(`/admin/bookings/${id}/reschedule`, body)
  return data
}
