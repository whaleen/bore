// netlify/functions/nodes.js
import prisma from './prisma'

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const nodes = await prisma.node.findMany({
      select: {
        id: true,
        name: true,
        country: true,
        countryCode: true,
        ipAddress: true,
        protocol: true,
        port: true,
        region: true,
        supportsUDP: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(nodes),
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch nodes', details: error.message }),
    }
  } finally {
    await prisma.$disconnect()
  }
}
