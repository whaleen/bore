// apps/web/netlify/functions/user-nodes.ts
import { Handler } from '@netlify/functions'
import prisma from './prisma'
import type { Node, UserSavedNode } from '@prisma/client'

interface UserNodesQueryParams {
  userId?: string
}

type SavedNodeWithDetails = Pick<UserSavedNode, 'id' | 'isPrimary'> & {
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

  try {
    const params = event.queryStringParameters as UserNodesQueryParams
    const userId = params?.userId

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' }),
      }
    }

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(savedNodes),
    }
  } catch (error) {
    console.error('Error fetching user nodes:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch user nodes',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
