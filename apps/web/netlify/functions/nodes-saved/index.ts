// apps/web/netlify/functions/nodes-saved/index.ts
import { Handler } from '@netlify/functions'
import prisma from '../prisma'
import {
  createResponse,
  createErrorResponse,
  validateBody,
  validateUserId,
} from '../utils/api'

// Request types
interface SetPrimaryNodeBody {
  userId: string
  nodeId: string
}

interface RemoveNodeBody {
  userId: string
  nodeId: string
}

export const handler: Handler = async (event) => {
  const { httpMethod } = event

  try {
    switch (httpMethod) {
      case 'GET': {
        // List user's saved nodes
        const userId = validateUserId(event.queryStringParameters?.userId)

        const savedNodes = await prisma.userSavedNode.findMany({
          where: {
            userId,
          },
          select: {
            id: true,
            isPrimary: true,
            node: {
              select: {
                id: true,
                name: true,
                country: true,
                countryCode: true,
                ipAddress: true,
                protocol: true,
                port: true,
                region: true,
                supportsUDP: true,
                isActive: true,
              },
            },
          },
          orderBy: [{ isPrimary: 'desc' }, { node: { name: 'asc' } }],
        })

        return createResponse(200, { nodes: savedNodes })
      }

      case 'PUT': {
        // Set primary node
        const data = validateBody<SetPrimaryNodeBody>(event.body)
        if (!data) {
          return createErrorResponse(400, 'No body provided', 'MISSING_BODY')
        }

        const { userId, nodeId } = data
        validateUserId(userId)

        // Update in transaction
        await prisma.$transaction([
          // Unset any existing primary nodes
          prisma.userSavedNode.updateMany({
            where: {
              userId,
              isPrimary: true,
            },
            data: {
              isPrimary: false,
            },
          }),
          // Set new primary node
          prisma.userSavedNode.update({
            where: {
              userId_nodeId: {
                userId,
                nodeId,
              },
            },
            data: {
              isPrimary: true,
            },
          }),
        ])

        return createResponse(200, { success: true })
      }

      case 'POST': {
        // Save a new node
        const {
          userId,
          nodeId,
          isPrimary = false,
        } = validateBody<SetPrimaryNodeBody & { isPrimary?: boolean }>(
          event.body
        ) || {}
        if (!userId || !nodeId) {
          return createErrorResponse(
            400,
            'Missing required fields',
            'MISSING_FIELDS'
          )
        }

        // If setting as primary, unset any existing primary nodes first
        if (isPrimary) {
          await prisma.userSavedNode.updateMany({
            where: {
              userId,
              isPrimary: true,
            },
            data: {
              isPrimary: false,
            },
          })
        }

        const savedNode = await prisma.userSavedNode.create({
          data: {
            userId,
            nodeId,
            isPrimary,
          },
          select: {
            id: true,
            isPrimary: true,
            node: {
              select: {
                id: true,
                name: true,
                country: true,
                countryCode: true,
                ipAddress: true,
                protocol: true,
                port: true,
                region: true,
                supportsUDP: true,
                isActive: true,
              },
            },
          },
        })

        return createResponse(201, savedNode)
      }

      case 'DELETE': {
        // Remove saved node
        const data = validateBody<RemoveNodeBody>(event.body)
        if (!data) {
          return createErrorResponse(400, 'No body provided', 'MISSING_BODY')
        }

        const { userId, nodeId } = data
        validateUserId(userId)

        await prisma.userSavedNode.delete({
          where: {
            userId_nodeId: {
              userId,
              nodeId,
            },
          },
        })

        return createResponse(204, null)
      }

      default:
        return createErrorResponse(
          405,
          'Method not allowed',
          'METHOD_NOT_ALLOWED'
        )
    }
  } catch (error) {
    console.error('Error in nodes-saved:', error)

    if (error instanceof Error) {
      if (error.message === 'User ID is required') {
        return createErrorResponse(400, error.message, 'MISSING_USER_ID')
      }

      if (error.message.includes('Record to update not found')) {
        return createErrorResponse(
          404,
          'Node not found or not saved by user',
          'NODE_NOT_FOUND'
        )
      }

      if (error.message.includes('Unique constraint')) {
        return createErrorResponse(
          409,
          'Node already saved by user',
          'ALREADY_SAVED'
        )
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
