// apps/web/netlify/functions/auth-users/index.ts
import { Handler } from '@netlify/functions'
import prisma from '../prisma'
import {
  createResponse,
  createErrorResponse,
  validateBody,
  validateUserId,
} from '../utils/api'

interface UpdateUserBody {
  userId: string
  theme?: string
  name?: string
}

export const handler: Handler = async (event) => {
  const { httpMethod } = event

  try {
    switch (httpMethod) {
      case 'GET': {
        const userId = validateUserId(event.queryStringParameters?.userId)

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            theme: true,
            devices: {
              // Changed from connections to devices
              where: {
                isActive: true,
              },
              select: {
                id: true,
                deviceName: true,
                deviceType: true,
                createdAt: true,
              },
            },
          },
        })

        if (!user) {
          return createErrorResponse(404, 'User not found', 'USER_NOT_FOUND')
        }

        return createResponse(200, user)
      }

      case 'PUT': {
        const data = validateBody<UpdateUserBody>(event.body)
        if (!data) {
          return createErrorResponse(400, 'No body provided', 'MISSING_BODY')
        }

        const { userId, ...updateData } = data
        validateUserId(userId)

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: updateData,
          select: {
            id: true,
            name: true,
            theme: true,
          },
        })

        return createResponse(200, updatedUser)
      }

      default:
        return createErrorResponse(
          405,
          'Method not allowed',
          'METHOD_NOT_ALLOWED'
        )
    }
  } catch (error) {
    console.error('Error in auth-users:', error)

    if (error instanceof Error) {
      if (error.message === 'User ID is required') {
        return createErrorResponse(400, error.message, 'MISSING_USER_ID')
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
