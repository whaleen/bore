// apps/web/netlify/functions/revoke-connection.ts
import { Handler } from '@netlify/functions'
import prisma from './prisma'
import type { ExtensionConnection } from '@prisma/client'

interface RevokeConnectionBody {
  userId: string
  connectionId: string
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    if (!event.body) {
      throw new Error('No body provided')
    }

    const { userId, connectionId } = JSON.parse(
      event.body
    ) as RevokeConnectionBody

    const [connection] = await prisma.$transaction([
      prisma.extensionConnection.update({
        where: {
          id: connectionId,
          userId: userId,
        },
        data: {
          isActive: false,
        },
      }),
      prisma.extensionAuth.deleteMany({
        where: {
          connection: {
            id: connectionId,
          },
        },
      }),
    ])

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(connection),
    }
  } catch (error) {
    console.error('Error revoking connection:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to revoke connection',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
