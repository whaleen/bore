// netlify/functions/save-node.js
import prisma from './prisma'

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const { userId, nodeId } = JSON.parse(event.body)

    let user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          name: `User-${userId.slice(0, 6)}`,
        },
      })
    }

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

    const isFirstNode = !(await prisma.userSavedNode.findFirst({
      where: { userId },
    }))

    const savedNode = await prisma.userSavedNode.create({
      data: {
        userId,
        nodeId,
        isPrimary: isFirstNode,
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
