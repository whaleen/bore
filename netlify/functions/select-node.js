const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  try {
    const { userId, node } = JSON.parse(event.body)

    // Create or update node selection for this user
    const result = await prisma.userSelectedNode.upsert({
      where: {
        userId: userId,
      },
      update: {
        nodeId: node.id,
      },
      create: {
        userId: userId,
        nodeId: node.id,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    }

  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to select node' })
    }
  }
}
