const SERVICE_IMAGES: Record<string, string> = {
  'Basic Wash': '/images/service-basic-wash.png',
  'Express Wash': '/images/service-express-wash.png',
  'Full Detail': '/images/service-full-detail.png',
  'Premium Detail': '/images/service-premium-detail.png',
}

export const DEFAULT_SERVICE_IMAGE = '/images/service-basic-wash.png'

interface ServiceImageLike {
  name?: string | null
  imageUrl?: string | null
}

export function getServiceImage(service: ServiceImageLike): string {
  if (service.imageUrl) return service.imageUrl
  if (service.name && SERVICE_IMAGES[service.name]) return SERVICE_IMAGES[service.name]
  return DEFAULT_SERVICE_IMAGE
}
