// apps/web/netlify/functions/auth-link-codes/index.ts
import { Handler } from '@netlify/functions'
import prisma from '../prisma'
import {
  createResponse,
  createErrorResponse,
  validateBody,
  validateUserId,
} from '../utils/api'
import crypto from 'crypto'

interface GenerateLinkCodeBody {
  userId: string
}

export const handler: Handler = async (event) => {
  const { httpMethod } = event

  try {
    if (httpMethod !== 'POST') {
      return createErrorResponse(
        405,
        'Method not allowed',
        'METHOD_NOT_ALLOWED'
      )
    }

    const data = validateBody<GenerateLinkCodeBody>(event.body)
    if (!data) {
      return createErrorResponse(400, 'No body provided', 'MISSING_BODY')
    }

    const { userId } = data
    validateUserId(userId)

    // Delete any existing unused codes
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

    return createResponse(200, linkCode)
  } catch (error) {
    console.error('Error generating link code:', error)

    if (error instanceof Error && error.message === 'User ID is required') {
      return createErrorResponse(400, error.message, 'MISSING_USER_ID')
    }

    return createErrorResponse(
      500,
      'Internal server error',
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
