// netlify/functions/verify-link-code.js
import prisma from './prisma'
import crypto from 'crypto'

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const { code } = JSON.parse(event.body)

    // Find and validate code
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

    // Generate permanent API key
    const apiKey = crypto.randomBytes(32).toString('hex')

    // Save API key
    await prisma.extensionAuth.create({
      data: {
        apiKey,
        userId: linkCode.userId,
      },
    })

    // Mark code as used
    await prisma.linkCode.update({
      where: { id: linkCode.id },
      data: { used: true },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ apiKey }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
