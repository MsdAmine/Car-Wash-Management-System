export interface VehicleResponse {
  id: string
  brand: string
  model: string
  licensePlate: string
  type: 'SEDAN' | 'SUV' | 'TRUCK' | 'VAN' | 'MOTORCYCLE' | 'COUPE'
  ownerEmail: string
}

export interface VehicleRequest {
  brand: string
  model: string
  licensePlate: string
  type: VehicleResponse['type']
}
