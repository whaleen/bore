// apps/web/netlify/functions/user/index.ts
import { Handler } from '@netlify/functions'
import prisma from '../prisma'
import {
  createResponse,
  createErrorResponse,
  validateBody,
  validateUserId,
} from '../utils/api'

interface UpdateUserData {
  id: string
  name?: string
  theme?: string
}

const userSelect = {
  id: true,
  name: true,
  theme: true,
  createdAt: true,
  updatedAt: true,
} as const

export const handler: Handler = async (event) => {
  const { httpMethod } = event

  try {
    switch (httpMethod) {
      case 'GET': {
        const userId = validateUserId(event.queryStringParameters?.userId)

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: userSelect,
        })

        if (!user) {
          return createErrorResponse(404, 'User not found', 'USER_NOT_FOUND')
        }

        return createResponse(200, user)
      }

      case 'POST': {
        const data = validateBody<{ id: string }>(event.body)
        if (!data) {
          return createErrorResponse(400, 'No body provided', 'MISSING_BODY')
        }

        const userId = validateUserId(data.id)

        const existingUser = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (existingUser) {
          return createErrorResponse(409, 'User already exists', 'USER_EXISTS')
        }

        const newUser = await prisma.user.create({
          data: {
            id: userId,
            name: `User ${userId.slice(0, 4)}`,
            theme: 'dark',
          },
          select: userSelect,
        })

        return createResponse(201, newUser)
      }

      case 'PUT': {
        const data = validateBody<UpdateUserData>(event.body)
        if (!data) {
          return createErrorResponse(400, 'No body provided', 'MISSING_BODY')
        }

        const { id: updateId, ...updateData } = data
        const userId = validateUserId(updateId)

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: updateData,
          select: userSelect,
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
    console.error('Error in user endpoint:', error)

    if (error instanceof Error && error.message === 'User ID is required') {
      return createErrorResponse(400, error.message, 'MISSING_USER_ID')
    }

    return createErrorResponse(
      500,
      'Internal server error',
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
