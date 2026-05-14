export interface WashServiceRequest {
    name: string;
    description?: string;
    price: number;
    durationMinutes: number;
    active?: boolean;
}

export interface WashServiceResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}
