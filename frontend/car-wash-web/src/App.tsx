import { lazy, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from '@/shared/lib/queryClient';
import { AuthProvider } from '@/shared/context/AuthContext';
import { ROUTES } from '@/router/routes';

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then(({ LoginPage }) => ({ default: LoginPage }))
);

const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then(({ ForgotPasswordPage }) => ({
    default: ForgotPasswordPage,
  }))
);

const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then(({ ResetPasswordPage }) => ({
    default: ResetPasswordPage,
  }))
);

const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then(({ RegisterPage }) => ({ default: RegisterPage }))
);

const BookingFlowPage = lazy(() =>
  import('@/features/bookings/pages/BookingFlowPage').then(({ BookingFlowPage }) => ({ default: BookingFlowPage }))
);

const ClientHomePage = lazy(() =>
  import('@/features/bookings/pages/ClientHomePage').then(({ ClientHomePage }) => ({ default: ClientHomePage }))
);

const ClientBookingsPage = lazy(() =>
  import('@/features/bookings/pages/ClientBookingsPage').then(({ ClientBookingsPage }) => ({ default: ClientBookingsPage }))
);

const ClientBookingDetailPage = lazy(() =>
  import('@/features/bookings/pages/ClientBookingDetailPage').then(({ ClientBookingDetailPage }) => ({ default: ClientBookingDetailPage }))
);

const WasherJobsPage = lazy(() =>
  import('@/features/washer/pages/WasherJobsPage').then(({ WasherJobsPage }) => ({ default: WasherJobsPage }))
);

const WasherJobDetailPage = lazy(() =>
  import('@/features/washer/pages/WasherJobDetailPage').then(({ WasherJobDetailPage }) => ({ default: WasherJobDetailPage }))
);

const WasherHistoryPage = lazy(() =>
  import('@/features/washer/pages/WasherHistoryPage').then(({ WasherHistoryPage }) => ({ default: WasherHistoryPage }))
);

const WasherAlertsPage = lazy(() =>
  import('@/features/washer/pages/WasherAlertsPage').then(({ WasherAlertsPage }) => ({ default: WasherAlertsPage }))
);

const WasherProfilePage = lazy(() =>
  import('@/features/washer/pages/WasherProfilePage').then(({ WasherProfilePage }) => ({ default: WasherProfilePage }))
);

const AdminDashboardPage = lazy(() =>
  import('@/features/admin/pages/AdminDashboardPage').then(({ AdminDashboardPage }) => ({ default: AdminDashboardPage }))
);

const AdminAssignPage = lazy(() =>
  import('@/features/admin/pages/AdminAssignPage').then(({ AdminAssignPage }) => ({ default: AdminAssignPage }))
);

const AdminBookingsPage = lazy(() =>
  import('@/features/bookings/pages/AdminBookingsPage').then(({ AdminBookingsPage }) => ({ default: AdminBookingsPage }))
);

const AdminBookingDetailPage = lazy(() =>
  import('@/features/bookings/pages/AdminBookingDetailPage').then(({ AdminBookingDetailPage }) => ({ default: AdminBookingDetailPage }))
);

const AdminServicesPage = lazy(() =>
  import('@/features/services/pages/AdminServicesPage').then(({ AdminServicesPage }) => ({ default: AdminServicesPage }))
);

const AdminStaffPage = lazy(() =>
  import('@/features/staff/pages/AdminStaffPage').then(({ AdminStaffPage }) => ({ default: AdminStaffPage }))
);

const AdminClientsPage = lazy(() =>
  import('@/features/clients/pages/AdminClientsPage').then(({ AdminClientsPage }) => ({ default: AdminClientsPage }))
);

const AdminAnalyticsPage = lazy(() =>
  import('@/features/admin/pages/AdminAnalyticsPage').then(({ AdminAnalyticsPage }) => ({ default: AdminAnalyticsPage }))
);

const ClientVehiclesPage = lazy(() =>
  import('@/features/vehicles/pages/ClientVehiclesPage').then(({ ClientVehiclesPage }) => ({ default: ClientVehiclesPage }))
);

const LandingPage = lazy(() =>
  import('@/features/auth/pages/LandingPage').then(({ LandingPage }) => ({ default: LandingPage }))
);

const ClientProfilePage = lazy(() =>
  import('@/features/auth/pages/ClientProfilePage').then(({ ClientProfilePage }) => ({ default: ClientProfilePage }))
);

const AdminSettingsPage = lazy(() =>
  import('@/features/admin/pages/AdminSettingsPage').then(({ AdminSettingsPage }) => ({ default: AdminSettingsPage }))
);

const WasherPendingPage = lazy(() =>
  import('@/features/auth/pages/WasherPendingPage').then(({ WasherPendingPage }) => ({ default: WasherPendingPage }))
);

const UnauthorizedPage = lazy(() =>
  import('@/features/auth/pages/UnauthorizedPage').then(({ UnauthorizedPage }) => ({ default: UnauthorizedPage }))
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<div className="min-h-screen bg-white" />}>
                  <LandingPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.PUBLIC.LOGIN}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <LoginPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.PUBLIC.FORGOT_PASSWORD}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <ForgotPasswordPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.PUBLIC.RESET_PASSWORD}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <ResetPasswordPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.PUBLIC.REGISTER}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <RegisterPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.CLIENT.HOME}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <ClientHomePage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.CLIENT.BOOK}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <BookingFlowPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.CLIENT.BOOKINGS}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <ClientBookingsPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.CLIENT.BOOKING_DETAIL(':id')}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <ClientBookingDetailPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.WASHER.HOME}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <WasherJobsPage />
                </Suspense>
              }
            />
            <Route
              path="/washer/jobs/:id"
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <WasherJobDetailPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.WASHER.HISTORY}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <WasherHistoryPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.WASHER.ALERTS}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <WasherAlertsPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.WASHER.PROFILE}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <WasherProfilePage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN.DASHBOARD}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <AdminDashboardPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN.BOOKINGS}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <AdminBookingsPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN.ASSIGN}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <AdminAssignPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/bookings/:id"
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <AdminBookingDetailPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN.SERVICES}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <AdminServicesPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN.STAFF}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <AdminStaffPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN.CLIENTS}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <AdminClientsPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN.ANALYTICS}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <AdminAnalyticsPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.CLIENT.VEHICLES}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <ClientVehiclesPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.CLIENT.PROFILE}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <ClientProfilePage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN.SETTINGS}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <AdminSettingsPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.PUBLIC.WASHER_PENDING}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <WasherPendingPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.PUBLIC.UNAUTHORIZED}
              element={
                <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                  <UnauthorizedPage />
                </Suspense>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
