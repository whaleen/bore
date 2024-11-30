// apps/web/netlify/functions/set-primary-node.ts
import { Handler } from '@netlify/functions'
import prisma from './prisma'
import type { UserSavedNode } from '@prisma/client'

interface SetPrimaryNodeBody {
  userId: string
  nodeId: string
}

type PrimaryNodeResponse = Pick<
  UserSavedNode,
  'id' | 'userId' | 'nodeId' | 'isPrimary' | 'updatedAt'
>

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    if (!event.body) {
      throw new Error('No body provided')
    }

    const { userId, nodeId } = JSON.parse(event.body) as SetPrimaryNodeBody

    // First, unset any existing primary nodes for this user
    await prisma.userSavedNode.updateMany({
      where: {
        userId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    })

    // Then set the new primary node
    const primaryNode = await prisma.userSavedNode.update({
      where: {
        userId_nodeId: {
          userId,
          nodeId,
        },
      },
      data: {
        isPrimary: true,
      },
      select: {
        id: true,
        userId: true,
        nodeId: true,
        isPrimary: true,
        updatedAt: true,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(primaryNode),
    }
  } catch (error) {
    // Check for not found error
    if (
      error instanceof Error &&
      error.message.includes('Record to update not found')
    ) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Node not found or not saved by user',
          code: 'NODE_NOT_FOUND',
        }),
      }
    }

    console.error('Error setting primary node:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to set primary node',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
