import { Handler } from '@netlify/functions'
import prisma from './prisma'
import crypto from 'crypto'

interface VerifyLinkCodeBody {
  code: string
}

export const handler: Handler = async (event) => {
  console.log('Starting verify-link-code function')
  console.log('Event:', event.body)

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
    if (!event.body) {
      throw new Error('No body provided')
    }

    const { code } = JSON.parse(event.body) as VerifyLinkCodeBody

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

    console.log('Found linkCode:', linkCode)

    if (!linkCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid or expired code' }),
      }
    }

    // Generate API key
    const apiKey = crypto.randomBytes(32).toString('hex')

    // Use transaction to create both records in the correct order
    console.log('Starting transaction')
    const result = await prisma.$transaction(async (tx) => {
      // First create the auth
      const auth = await tx.extensionAuth.create({
        data: {
          apiKey,
          userId: linkCode.userId,
        },
      })
      console.log('Created auth:', auth)

      // Then create the connection with the auth id
      const connection = await tx.extensionConnection.create({
        data: {
          userId: linkCode.userId,
          deviceName: 'Chrome Extension',
          isActive: true,
          authId: auth.id,
        },
      })
      console.log('Created connection:', connection)

      return {
        auth,
        connection,
      }
    })
    console.log('Transaction result:', result)

    // Mark code as used
    await prisma.linkCode.update({
      where: { id: linkCode.id },
      data: { used: true },
    })

    const responsePayload = {
      apiKey,
      userId: linkCode.userId,
      connection: result.connection,
    }
    console.log('Sending response payload:', responsePayload)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responsePayload),
    }
  } catch (error) {
    console.error('Error in verify-link-code:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
