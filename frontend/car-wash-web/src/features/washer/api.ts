import api from '@/shared/lib/axios'
import type { UpdateStatusRequest } from './types'
import type { BookingResponse } from '@/features/bookings/types'

export async function fetchMyJobsToday(): Promise<BookingResponse[]> {
  const { data } = await api.get<BookingResponse[]>('/employees/me/bookings/today/details')
  return data
}

export async function fetchMyBookingHistory(): Promise<BookingResponse[]> {
  const { data } = await api.get<BookingResponse[]>('/employees/me/bookings/history/details')
  return data
}

export async function fetchBookingById(id: string): Promise<BookingResponse> {
  const { data } = await api.get<BookingResponse>(`/bookings/${id}`)
  return data
}

export async function updateBookingStatus(
  id: string,
  body: UpdateStatusRequest,
): Promise<BookingResponse> {
  const { data } = await api.patch<BookingResponse>(`/bookings/${id}/status`, body)
  return data
}
