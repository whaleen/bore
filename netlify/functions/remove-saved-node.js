// netlify/functions/remove-saved-node.js
import prisma from './prisma'

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const { userId, nodeId } = JSON.parse(event.body)

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
    console.error('Error removing saved node:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to remove saved node', details: error.message }),
    }
  }
}
