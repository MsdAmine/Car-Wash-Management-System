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

export interface BusinessSettingsResponse {
  businessName: string
  phone: string
  address: string
  city: string
  cancellationHours: number
  updatedAt: string
}

export interface BusinessSettingsRequest {
  businessName: string
  phone: string
  address: string
  city: string
  cancellationHours: number
}

export interface OperatingHoursResponse {
  id: number
  dayOfWeek: string
  openTime: string
  closeTime: string
  isOpen: boolean
}

export interface OperatingHoursDayRequest {
  dayOfWeek: string
  openTime: string
  closeTime: string
  isOpen: boolean
}

export interface UpdateOperatingHoursRequest {
  days: OperatingHoursDayRequest[]
}

export interface ServiceBookingStatResponse {
  serviceId: string
  serviceName: string
  bookingCount: number
  percentage: number
}

export interface HeatmapResponse {
  days: string[]
  slots: string[]
  data: number[][]
}
