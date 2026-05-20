import api from '@/shared/lib/axios'
import type { WashServiceResponse, WashServiceRequest } from './types'

export async function fetchActiveServices(): Promise<WashServiceResponse[]> {
  const { data } = await api.get<WashServiceResponse[]>('/services/active')
  return data
}

export async function fetchAllServices(): Promise<WashServiceResponse[]> {
  const { data } = await api.get<WashServiceResponse[]>('/services')
  return data
}

export async function createService(body: WashServiceRequest): Promise<WashServiceResponse> {
  const { data } = await api.post<WashServiceResponse>('/services', body)
  return data
}

export async function updateService(
  id: string,
  body: WashServiceRequest,
): Promise<WashServiceResponse> {
  const { data } = await api.put<WashServiceResponse>(`/services/${id}`, body)
  return data
}

export async function deactivateService(id: string): Promise<WashServiceResponse> {
  const { data } = await api.patch<WashServiceResponse>(`/services/${id}/deactivate`)
  return data
}
