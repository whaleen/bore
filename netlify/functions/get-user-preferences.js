// netlify/functions/get-user-preferences.js
import prisma from './prisma'

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const userId = event.queryStringParameters?.userId

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' })
      }
    }

    const userWithPrefs = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        extensionAuth: {
          include: {
            connection: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    // Extract active connections from extension auth records
    const activeConnections = userWithPrefs?.extensionAuth
      .map(auth => auth.connection)
      .filter(conn => conn !== null) || []

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        theme: userWithPrefs?.theme || 'dark',
        connections: activeConnections
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
