export interface EmployeeResponse {
  id: string
  userId: string
  email: string
  firstName: string
  lastName: string
  phone: string
  position: string
  hireDate: string
  active: boolean
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}
