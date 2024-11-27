// netlify/functions/generate-link-code.js
import prisma from './prisma'

function generateCode() {
  return Math.random().toString().slice(2, 8)
}

export const handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    const { userId } = JSON.parse(event.body)

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userId is required' }),
      }
    }

    // Generate unique 6-digit code
    const linkCode = generateCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Store code in database
    const createdLinkCode = await prisma.linkCode.create({
      data: {
        code: linkCode,
        userId: userId,
        expiresAt,
        used: false,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ code: linkCode }),
    }
  } catch (error) {
    console.error('Error generating link code:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    }
  } finally {
    await prisma.$disconnect()
  }
}
