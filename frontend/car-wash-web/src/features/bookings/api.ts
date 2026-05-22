import api from '@/shared/lib/axios'
import type { AvailableSlotsResponse, BookingRequest, BookingResponse } from './types'

export async function fetchMyBookings(): Promise<BookingResponse[]> {
  const { data } = await api.get<BookingResponse[]>('/bookings/my')
  return data
}

export async function createBooking(payload: BookingRequest): Promise<BookingResponse> {
  const { data } = await api.post<BookingResponse>('/bookings', payload)
  return data
}

export async function cancelBooking(id: string): Promise<BookingResponse> {
  const { data } = await api.patch<BookingResponse>(`/bookings/${id}/cancel`)
  return data
}

export async function rescheduleMyBooking(id: string, appointmentDateTime: string): Promise<BookingResponse> {
  const { data } = await api.patch<BookingResponse>(`/bookings/${id}/reschedule`, { appointmentDateTime })
  return data
}

export async function fetchAvailableSlots(
  date: string,
  serviceId: string,
): Promise<AvailableSlotsResponse> {
  const { data } = await api.get<AvailableSlotsResponse>('/bookings/available-slots', {
    params: { date, serviceId },
  })
  return data
}
