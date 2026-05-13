export type VehicleType = 'SEDAN' | 'SUV' | 'TRUCK' | 'VAN' | 'MOTORCYCLE' | 'COUPE';

export interface VehicleRequest {
    brand: string;
    model: string;
    licensePlate: string;
    type: VehicleType;
}

export interface VehicleResponse {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    type: VehicleType;
    ownerEmail: string;
}
