import api from '@/shared/lib/axios'
import type { CustomerResponse } from './types'

export async function fetchAllCustomers(): Promise<CustomerResponse[]> {
  const { data } = await api.get<CustomerResponse[]>('/customers')
  return data
}
