import api from '@/shared/lib/axios'
import type { EmployeeResponse } from './types'

export async function fetchAllEmployees(): Promise<EmployeeResponse[]> {
  const { data } = await api.get<EmployeeResponse[]>('/employees')
  return data
}

export async function activateEmployee(id: string): Promise<EmployeeResponse> {
  const { data } = await api.patch<EmployeeResponse>(`/employees/${id}/activate`)
  return data
}
