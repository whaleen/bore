import { Handler } from '@netlify/functions'
import prisma from './prisma'
import type { ExtensionConnection, ExtensionAuth } from '@prisma/client'

interface InactivateConnectionBody {
  action: 'inactivate'
  connectionId: string
  userId: string
}

interface GetConnectionsBody {
  action: 'get'
  userId: string
}

type RequestBody = InactivateConnectionBody | GetConnectionsBody

type ConnectionResponse = Pick<
  ExtensionConnection,
  'id' | 'deviceName' | 'createdAt' | 'isActive'
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

    const requestData = JSON.parse(event.body) as RequestBody
    const { action } = requestData

    switch (action) {
      case 'inactivate': {
        const { connectionId, userId } = requestData
        const connection = await prisma.extensionConnection.update({
          where: {
            id: connectionId,
            userId,
          },
          data: {
            isActive: false,
          },
        })

        // Also delete the associated auth
        await prisma.extensionAuth.delete({
          where: {
            id: connection.authId,
          },
        })

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        }
      }

      case 'get': {
        const { userId } = requestData
        const connections = await prisma.extensionConnection.findMany({
          where: {
            userId,
            isActive: true,
          },
          select: {
            id: true,
            deviceName: true,
            createdAt: true,
            isActive: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(connections),
        }
      }

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' }),
        }
    }
  } catch (error) {
    console.error('Error managing extension connection:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to manage extension connection',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
