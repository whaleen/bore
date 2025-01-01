// apps/web/netlify/functions/auth-devices/index.ts
import { Handler } from '@netlify/functions'
import prisma from '../prisma'
import {
  createResponse,
  createErrorResponse,
  validateBody,
  validateUserId,
} from '../utils/api'

interface UpdateDeviceBody {
  userId: string
  connectionId: string
  deviceName: string
}

interface RevokeDeviceBody {
  userId: string
  connectionId: string
}

export const handler: Handler = async (event) => {
  const { httpMethod } = event

  try {
    switch (httpMethod) {
      case 'GET': {
        const userId = validateUserId(event.queryStringParameters?.userId)

        const devices = await prisma.deviceConnection.findMany({
          where: {
            userId,
            isActive: true,
          },
          select: {
            id: true,
            deviceName: true,
            deviceType: true,
            createdAt: true,
            lastSeen: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return createResponse(200, { devices })
      }

      case 'PUT': {
        const data = validateBody<UpdateDeviceBody>(event.body)
        if (!data) {
          return createErrorResponse(400, 'No body provided', 'MISSING_BODY')
        }

        const { userId, connectionId, deviceName } = data
        validateUserId(userId)

        const device = await prisma.deviceConnection.update({
          where: {
            id: connectionId,
            AND: {
              userId,
              isActive: true,
            },
          },
          data: {
            deviceName,
          },
          select: {
            id: true,
            deviceName: true,
            deviceType: true,
            userId: true,
          },
        })

        return createResponse(200, device)
      }

      case 'DELETE': {
        const data = validateBody<RevokeDeviceBody>(event.body)
        if (!data) {
          return createErrorResponse(400, 'No body provided', 'MISSING_BODY')
        }

        const { userId, connectionId } = data
        validateUserId(userId)

        await prisma.$transaction([
          prisma.deviceAuth.deleteMany({
            where: {
              connection: {
                id: connectionId,
                userId,
              },
            },
          }),
          prisma.deviceConnection.updateMany({
            where: {
              id: connectionId,
              userId,
            },
            data: {
              isActive: false,
            },
          }),
        ])

        return createResponse(200, { message: 'Device unlinked successfully' })
      }

      default:
        return createErrorResponse(
          405,
          'Method not allowed',
          'METHOD_NOT_ALLOWED'
        )
    }
  } catch (error) {
    console.error('Error in auth-devices:', error)

    if (error instanceof Error) {
      if (error.message === 'User ID is required') {
        return createErrorResponse(400, error.message, 'MISSING_USER_ID')
      }

      if (error.message.includes('Record to update not found')) {
        return createErrorResponse(404, 'Device not found', 'DEVICE_NOT_FOUND')
      }
    }

    return createErrorResponse(
      500,
      'Internal server error',
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
