import { Handler } from '@netlify/functions'
import prisma from './prisma'
import type { ExtensionConnection } from '@prisma/client'

interface UpdateDeviceNameBody {
  userId: string
  connectionId: string
  deviceName: string
}

type ConnectionResponse = Pick<
  ExtensionConnection,
  'id' | 'deviceName' | 'userId'
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

    const { userId, connectionId, deviceName } = JSON.parse(
      event.body
    ) as UpdateDeviceNameBody

    const updatedConnection = await prisma.extensionConnection.update({
      where: {
        id: connectionId,
        AND: {
          userId,
          isActive: true,
        },
      },
      data: {
        deviceName,
      },
      select: {
        id: true,
        deviceName: true,
        userId: true,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedConnection),
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
          error: 'Connection not found',
          code: 'CONNECTION_NOT_FOUND',
        }),
      }
    }

    console.error('Error updating device name:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to update device name',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
