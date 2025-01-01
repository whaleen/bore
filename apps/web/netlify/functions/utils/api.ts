// apps/web/netlify/functions/utils/api.ts
import { ApiError, commonHeaders } from '../types'

export const createResponse = (statusCode: number, data: any) => ({
  statusCode,
  headers: commonHeaders,
  body: JSON.stringify(data),
})

export const createErrorResponse = (
  statusCode: number,
  error: string,
  code: string,
  details?: string
) =>
  createResponse(statusCode, {
    error,
    code,
    ...(details && { details }),
  } as ApiError)

export const validateBody = <T>(body: string | null): T | null => {
  if (!body) return null
  return JSON.parse(body) as T
}

export const validateUserId = (userId: string | undefined) => {
  if (!userId) {
    throw new Error('User ID is required')
  }
  return userId
}
