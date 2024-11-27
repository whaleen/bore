// netlify/functions/save-node.js
import prisma from './prisma'

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const { userId, nodeId } = JSON.parse(event.body)

    // Check if user exists, if not create them
    let user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          name: `User-${userId.slice(0, 6)}`, // Create a temporary name
        },
      })
    }

    // Check if node is already saved
    const existingSave = await prisma.userSavedNode.findUnique({
      where: {
        userId_nodeId: {
          userId,
          nodeId,
        },
      },
    })

    if (existingSave) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Node already saved' }),
      }
    }

    // Check if this is the user's first saved node
    const isFirstNode = !(await prisma.userSavedNode.findFirst({
      where: { userId },
    }))

    // Save the node for the user
    const savedNode = await prisma.userSavedNode.create({
      data: {
        userId,
        nodeId,
        isPrimary: isFirstNode, // Make primary if it's the first node
      },
      include: {
        node: true,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(savedNode),
    }
  } catch (error) {
    console.error('Error saving node:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to save node', details: error.message }),
    }
  } finally {
    await prisma.$disconnect()
  }
}
