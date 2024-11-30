import { Handler } from '@netlify/functions'
import prisma from './prisma'
import type { User } from '@prisma/client'

interface UpdateUserPreferencesBody {
  userId: string
  theme: string
}

type PreferencesResponse = Pick<User, 'theme'>

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

    const { userId, theme } = JSON.parse(
      event.body
    ) as UpdateUserPreferencesBody
    console.log('Received request to update theme:', { userId, theme })

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { theme },
      select: { theme: true },
    })

    console.log('Updated user theme:', updatedUser)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedUser),
    }
  } catch (error) {
    // Handle record not found
    if (
      error instanceof Error &&
      error.message.includes('Record to update not found')
    ) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        }),
      }
    }

    console.error('Error updating user preferences:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to update user preferences',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
