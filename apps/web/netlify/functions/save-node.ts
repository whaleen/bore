import { Handler } from '@netlify/functions'
import prisma from './prisma'
import type { UserSavedNode, Node } from '@prisma/client'

interface SaveNodeBody {
  nodeId: string
  userId: string
  isPrimary?: boolean
}

type SavedNodeResponse = Pick<
  UserSavedNode,
  'id' | 'userId' | 'nodeId' | 'isPrimary'
> & {
  node: Pick<
    Node,
    | 'id'
    | 'name'
    | 'country'
    | 'countryCode'
    | 'ipAddress'
    | 'protocol'
    | 'port'
    | 'region'
    | 'supportsUDP'
    | 'isActive'
  >
}

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

    const {
      nodeId,
      userId,
      isPrimary = false,
    } = JSON.parse(event.body) as SaveNodeBody

    // If setting as primary, unset any existing primary nodes
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
        nodeId,
        userId,
        isPrimary,
      },
      select: {
        id: true,
        userId: true,
        nodeId: true,
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(savedNode),
    }
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({
          error: 'Node already saved by user',
          code: 'ALREADY_SAVED',
        }),
      }
    }

    console.error('Error saving node:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to save node',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
