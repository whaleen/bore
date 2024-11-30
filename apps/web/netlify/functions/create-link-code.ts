// apps/web/netlify/functions/create-link-code.ts
import { Handler } from '@netlify/functions'
import prisma from './prisma'
import type { LinkCode } from '@prisma/client'
import crypto from 'crypto'

interface GenerateLinkCodeBody {
  userId: string
}

type LinkCodeResponse = Pick<LinkCode, 'code' | 'expiresAt'>

export const handler: Handler = async (event) => {
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

    const { userId } = JSON.parse(event.body) as GenerateLinkCodeBody

    // Delete any existing unused codes for this user
    await prisma.linkCode.deleteMany({
      where: {
        userId,
        used: false,
      },
    })

    // Generate new code
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const linkCode = await prisma.linkCode.create({
      data: {
        code,
        userId,
        expiresAt,
      },
      select: {
        code: true,
        expiresAt: true,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(linkCode),
    }
  } catch (error) {
    console.error('Error creating link code:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create link code',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
