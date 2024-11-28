// netlify/functions/update-device-name.js
import prisma from './prisma'

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const { userId, connectionId, deviceName } = JSON.parse(event.body)

    const updated = await prisma.extensionConnection.update({
      where: {
        id: connectionId,
        AND: {
          userId: userId,
          isActive: true,
        }
      },
      data: {
        deviceName,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updated),
    }
  } catch (error) {
    console.error('Error updating device name:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update device name' }),
    }
  }
}
