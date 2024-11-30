import { Handler } from '@netlify/functions'
import prisma from './prisma'

interface RemoveSavedNodeBody {
  userId: string
  nodeId: string
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

    const { userId, nodeId } = JSON.parse(event.body) as RemoveSavedNodeBody

    await prisma.userSavedNode.delete({
      where: {
        userId_nodeId: {
          userId,
          nodeId,
        },
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    }
  } catch (error) {
    // Handle not found error
    if (
      error instanceof Error &&
      error.message.includes('Record to delete does not exist')
    ) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Node not found or not saved by user',
          code: 'NODE_NOT_FOUND',
        }),
      }
    }

    console.error('Error removing saved node:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to remove saved node',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
