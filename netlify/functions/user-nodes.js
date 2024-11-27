// netlify/functions/user-nodes.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.handler = async function (event, context) {
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
        body: JSON.stringify({ error: 'User ID is required' }),
      }
    }

    const savedNodes = await prisma.userSavedNode.findMany({
      where: {
        userId
      },
      include: {
        node: true,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(savedNodes),
    }
  } catch (error) {
    console.error('Error fetching user nodes:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch user nodes', details: error.message }),
    }
  } finally {
    await prisma.$disconnect()
  }
}
