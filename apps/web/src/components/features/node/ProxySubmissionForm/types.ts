export interface ProxyFormData {
  name: string
  country: string
  ipAddress: string
  protocol: 'HTTP' | 'HTTPS' | 'SOCKS5'
  port: string
  username: string
  password: string
  supportsUDP: boolean
  notes: string
}

export interface SubmissionResponse {
  success: boolean
  error?: string
  nodeId?: string
}

export interface CountryData {
  name: string
  code: string
}

export interface ProxySubmissionFormProps {
  onSuccess?: (nodeId: string) => void
  onError?: (error: string) => void
  className?: string
}
