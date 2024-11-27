// netlify/functions/verify-link-code.js
import prisma from './prisma'
import crypto from 'crypto'

export const handler = async (event, context) => {
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
    const { code } = JSON.parse(event.body)

    const linkCode = await prisma.linkCode.findFirst({
      where: {
        code,
        expiresAt: {
          gt: new Date(),
        },
        used: false,
      },
      include: {
        user: true,
      },
    })

    if (!linkCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid or expired code' }),
      }
    }

    // Generate API key
    const apiKey = crypto.randomBytes(32).toString('hex')

    // Create auth record with connected extension
    const extensionAuth = await prisma.extensionAuth.create({
      data: {
        apiKey,
        userId: linkCode.userId,
        connection: {
          create: {
            userId: linkCode.userId,
            deviceName: 'Chrome Extension',
            isActive: true
          }
        }
      },
      include: {
        connection: true
      }
    })

    // Mark code as used
    await prisma.linkCode.update({
      where: { id: linkCode.id },
      data: { used: true },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        apiKey,
        userId: linkCode.userId
      }),
    }
  } catch (error) {
    console.error('Error verifying link code:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
