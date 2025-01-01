export interface VultrNodeCreatorProps {
  apiKey?: string
  onSuccess?: (instanceId: string) => void
  onError?: (error: string) => void
}

export interface VultrRegion {
  id: string
  name: string
  country: string
  continent: string
}

export interface VultrPlan {
  id: string
  name: string
  vcpu_count: number
  ram: number
  disk: number
  price_per_month: number
}

export interface VultrOS {
  id: number
  name: string
  arch: string
  family: string
}

export interface CreationState {
  region: string
  plan: string
  os: string
  loading: boolean
  message: string
}
