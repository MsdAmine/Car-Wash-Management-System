type AxiosLike = {
    response?: {
        status?: number;
        data?: { message?: string };
    };
};

export function getApiErrorMessage(
    err: unknown,
    overrides?: Partial<Record<number, string>>,
    fallback = 'An unexpected error occurred. Please try again.'
): string {
    const axiosErr = err as AxiosLike;
    const status = axiosErr?.response?.status;
    const serverMsg = axiosErr?.response?.data?.message;

    if (overrides && status && overrides[status]) return overrides[status]!;
    if (serverMsg) return serverMsg;
    if (!axiosErr?.response) return 'Network error. Please check your connection and try again.';

    switch (status) {
        case 400: return 'Invalid request. Please check your input and try again.';
        case 401: return 'Your session has expired. Please log in again.';
        case 403: return 'You do not have permission to perform this action.';
        case 404: return 'The requested resource was not found.';
        case 409: return 'A conflict occurred. The resource may already exist.';
    }
    if (status && status >= 500) return 'Server error. Please try again later.';
    return fallback;
}
