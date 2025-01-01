// types.ts
import type { Handler } from '@netlify/functions'

// Base node shape that we typically return to clients
export interface NodeResponse {
  id: string
  name: string
  country: string
  countryCode: string
  ipAddress: string
  protocol: string | null
  port: number
  region: string
  supportsUDP: boolean
  isActive: boolean
}

// Error response shapes
export interface ApiError {
  error: string
  code?: string
  details?: string
}

// Base API Response
export interface ApiResponse<T> {
  statusCode: number
  headers: typeof commonHeaders
  body: string // Stringified T or ApiError
}

// Device and Connection types
export interface DeviceConnection {
  id: string
  deviceName: string | null
  deviceType: string
  lastSeen: Date
  createdAt: Date
  isActive: boolean
}

export interface GetUserDevicesResponse {
  devices: DeviceConnection[]
}

// GET /nodes - Get all nodes
export interface GetNodesResponse {
  nodes: NodeResponse[]
}

// GET /user-nodes?userId={id} - Get nodes saved by a user
export interface UserSavedNodeResponse {
  id: string
  isPrimary: boolean
  createdAt: Date
  node: NodeResponse
}

export interface GetUserNodesResponse {
  nodes: UserSavedNodeResponse[]
}

// save-node specific types
export interface SaveNodeRequest {
  nodeId: string
  userId: string
  isPrimary?: boolean
}

export interface SaveNodeResponse {
  id: string
  userId: string
  nodeId: string
  isPrimary: boolean
  createdAt: Date
  node: NodeResponse
}

// Device management types
export interface UpdateDeviceRequest {
  userId: string
  connectionId: string
  deviceName: string
}

export interface RevokeDeviceRequest {
  userId: string
  connectionId: string
}

// Link code types
export interface CreateLinkCodeRequest {
  userId: string
}

export interface CreateLinkCodeResponse {
  code: string
  expiresAt: Date
}

export interface VerifyLinkCodeRequest {
  code: string
}

export interface VerifyLinkCodeResponse {
  apiKey: string
  userId: string
  connection: DeviceConnection
}

// Common response headers
export const commonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const

// Type helper for handlers
export type TypedHandler<TRequest = unknown, TResponse = unknown> = Handler & {
  (event: {
    body: TRequest extends undefined ? null : string
    rawUrl: string
    rawQuery: string
    path: string
    httpMethod: string
    headers: { [key: string]: string }
    queryStringParameters: { [key: string]: string } | null
  }): Promise<ApiResponse<TResponse | ApiError>>
}
