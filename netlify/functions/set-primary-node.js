// netlify/functions/set-primary-node.js
import prisma from './prisma'

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const { userId, nodeId } = JSON.parse(event.body)

    await prisma.userSavedNode.updateMany({
      where: {
        userId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    })

    const updatedNode = await prisma.userSavedNode.update({
      where: {
        userId_nodeId: {
          userId,
          nodeId,
        },
      },
      data: {
        isPrimary: true,
      },
      include: {
        node: true,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedNode),
    }
  } catch (error) {
    console.error('Error setting primary node:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to set primary node', details: error.message }),
    }
  }
}
