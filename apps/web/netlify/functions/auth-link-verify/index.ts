// apps/web/netlify/functions/auth-link-verify/index.ts
//
import { Handler } from '@netlify/functions'
import prisma from '../prisma'
import { createResponse, createErrorResponse, validateBody } from '../utils/api'
import crypto from 'crypto'

interface VerifyLinkCodeBody {
  code: string
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

    const data = validateBody<VerifyLinkCodeBody>(event.body)
    if (!data) {
      return createErrorResponse(400, 'No body provided', 'MISSING_BODY')
    }

    const { code } = data

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
      return createErrorResponse(400, 'Invalid or expired code', 'INVALID_CODE')
    }

    const apiKey = crypto.randomBytes(32).toString('hex')

    const result = await prisma.$transaction(async (tx) => {
      const auth = await tx.deviceAuth.create({
        data: {
          apiKey,
          userId: linkCode.userId,
        },
      })

      const connection = await tx.deviceConnection.create({
        data: {
          userId: linkCode.userId,
          deviceName: 'Chrome Extension',
          deviceType: 'CHROME_EXTENSION',
          isActive: true,
          authId: auth.id,
        },
      })

      await tx.linkCode.update({
        where: { id: linkCode.id },
        data: { used: true },
      })

      return {
        apiKey,
        userId: linkCode.userId,
        connection,
      }
    })

    return createResponse(200, result)
  } catch (error) {
    console.error('Error verifying link code:', error)
    return createErrorResponse(
      500,
      'Internal server error',
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
