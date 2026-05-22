export interface WashServiceResponse {
  id: string
  name: string
  description: string
  price: number
  durationMinutes: number
  active: boolean
  imageUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface WashServiceRequest {
  name: string
  description: string
  price: number
  durationMinutes: number
  active: boolean
  imageUrl?: string | null
}
