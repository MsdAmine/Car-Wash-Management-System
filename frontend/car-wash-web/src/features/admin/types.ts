export interface ServiceStatResponse {
  serviceName: string
  bookingCount: number
}

export interface AdminDashboardResponse {
  totalBookings: number
  todaysBookings: number
  pendingBookings: number
  completedBookings: number
  dailyRevenue: number
  monthlyRevenue: number
  mostRequestedServices: ServiceStatResponse[]
}

export interface AssignEmployeeRequest {
  employeeId: string
}

export interface RevenueDataPoint {
  label: string
  revenue: number
}

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
