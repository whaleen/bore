import { Handler } from '@netlify/functions'
import prisma from './prisma'
import type { User, ExtensionConnection } from '@prisma/client'

interface UserQueryParams {
  userId?: string | null
}

type UserPreferencesResponse = Pick<User, 'theme'> & {
  connections: Pick<ExtensionConnection, 'id' | 'deviceName' | 'createdAt'>[]
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const params = event.queryStringParameters as UserQueryParams
    const userId = params?.userId

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' }),
      }
    }

    const userPrefs = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        theme: true,
        connections: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            deviceName: true,
            createdAt: true,
          },
        },
      },
    })

    if (!userPrefs) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(userPrefs),
    }
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch user preferences',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
