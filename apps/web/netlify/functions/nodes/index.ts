// apps/web/netlify/functions/nodes/index.ts
import { Handler } from '@netlify/functions'
import prisma from '../prisma'
import {
  SaveNodeRequest,
  SaveNodeResponse,
  ApiError,
  commonHeaders,
} from '../types'

const handler: Handler = async (event) => {
  const { httpMethod } = event

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    switch (httpMethod) {
      case 'GET':
        // Extract query parameters from the event
        const { countryCode, protocol, region, isActive } =
          event.queryStringParameters || {}

        // Build a dynamic filter object for Prisma
        const filters: any = {}
        if (countryCode) filters.countryCode = countryCode
        if (protocol) filters.protocol = protocol
        if (region) filters.region = region
        if (isActive !== undefined) filters.isActive = isActive === 'true' // Convert string to boolean

        // Query the database with filters
        const nodes = await prisma.node.findMany({
          where: filters,
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
            isActive: true,
          },
        })

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ nodes }),
        }

      case 'POST':
        if (!event.body) {
          return {
            statusCode: 400,
            headers: commonHeaders,
            body: JSON.stringify({
              error: 'No body provided',
              code: 'MISSING_BODY',
            } as ApiError),
          }
        }

        const {
          nodeId,
          userId,
          isPrimary = false,
        }: SaveNodeRequest = JSON.parse(event.body)

        // If setting as primary, unset any existing primary nodes
        if (isPrimary) {
          await prisma.userSavedNode.updateMany({
            where: {
              userId,
              isPrimary: true,
            },
            data: {
              isPrimary: false,
            },
          })
        }

        const savedNode = (await prisma.userSavedNode.create({
          data: {
            nodeId,
            userId,
            isPrimary,
          },
          select: {
            id: true,
            userId: true,
            nodeId: true,
            isPrimary: true,
            node: {
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
                isActive: true,
              },
            },
          },
        })) as SaveNodeResponse

        return {
          statusCode: 200,
          headers: commonHeaders,
          body: JSON.stringify(savedNode),
        }

      case 'PUT':
        // Add logic to handle PUT requests for updating a node
        // ...
        break

      case 'DELETE':
        // Add logic to handle DELETE requests for deleting a node
        // ...
        break

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return {
        statusCode: 409,
        headers: commonHeaders,
        body: JSON.stringify({
          error: 'Node already saved by user',
          code: 'ALREADY_SAVED',
        } as ApiError),
      }
    }

    console.error('Error in nodes endpoint:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_ERROR',
      } as ApiError),
    }
  }
}

export { handler }
