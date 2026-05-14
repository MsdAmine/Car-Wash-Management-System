export interface ServiceStatResponse {
    serviceName: string;
    bookingCount: number;
}

export interface AdminDashboardResponse {
    totalBookings: number;
    todaysBookings: number;
    pendingBookings: number;
    completedBookings: number;
    dailyRevenue: number;
    monthlyRevenue: number;
    mostRequestedServices: ServiceStatResponse[];
}

export interface CustomerDashboardResponse {
    upcomingBookings: number;
    previousBookings: number;
    registeredVehicles: number;
}

export interface EmployeeDashboardResponse {
    assignedBookings: number;
    bookingsInProgress: number;
}
