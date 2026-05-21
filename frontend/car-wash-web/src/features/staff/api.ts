import api from '@/shared/lib/axios'
import type { EmployeeResponse } from './types'

export interface UpdateEmployeeBody {
  position: string
  hireDate: string
}

export async function fetchAllEmployees(): Promise<EmployeeResponse[]> {
  const { data } = await api.get<EmployeeResponse[]>('/employees')
  return data
}

export async function activateEmployee(id: string): Promise<EmployeeResponse> {
  const { data } = await api.patch<EmployeeResponse>(`/employees/${id}/activate`)
  return data
}

export async function deactivateEmployee(id: string): Promise<void> {
  await api.delete(`/employees/${id}`)
}

export async function updateEmployee(id: string, body: UpdateEmployeeBody): Promise<EmployeeResponse> {
  const { data } = await api.put<EmployeeResponse>(`/employees/${id}`, body)
  return data
}
