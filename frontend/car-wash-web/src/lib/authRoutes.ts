import { ROUTES } from '../routes';
import type { UserRole } from '../types/auth';

export const dashboardPathByRole: Record<UserRole, string> = {
    ADMIN: ROUTES.ADMIN_DASHBOARD,
    EMPLOYEE: ROUTES.EMPLOYEE_DASHBOARD,
    CUSTOMER: ROUTES.CUSTOMER_DASHBOARD,
};

export const getDashboardPath = (role?: UserRole | null) =>
    role ? dashboardPathByRole[role] : ROUTES.LOGIN;
