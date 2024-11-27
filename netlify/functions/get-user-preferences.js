// netlify/functions/get-user-preferences.js
import prisma from './prisma'

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    // Extract user ID from Authorization header or query params
    const userId = event.headers.authorization?.split(' ')[1] ||
      event.queryStringParameters?.userId

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' })
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        theme: true,
        extensionAuth: {
          include: {
            connection: true
          }
        }
      }
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        theme: user?.theme || 'dark',
        connections: user?.extensionAuth.map(auth => auth.connection) || []
      })
    }
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch user preferences' })
    }
  }
}
