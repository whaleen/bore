import { Handler } from '@netlify/functions'
import prisma from './prisma'
import type { Node } from '@prisma/client'

interface EditNodeBody {
  id: string
  name?: string
  country?: string
  countryCode?: string
  ipAddress?: string
  protocol?: string
  port?: number
  region?: string
  supportsUDP?: boolean
  username?: string
  password?: string
  notes?: string
  isActive?: boolean
}

type NodeResponse = Pick<
  Node,
  | 'id'
  | 'name'
  | 'country'
  | 'countryCode'
  | 'ipAddress'
  | 'protocol'
  | 'port'
  | 'region'
  | 'supportsUDP'
  | 'isActive'
  | 'updatedAt'
>

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

    const data = JSON.parse(event.body) as EditNodeBody
    const { id, ...updateData } = data

    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Node ID is required' }),
      }
    }

    const updatedNode = await prisma.node.update({
      where: { id },
      data: updateData,
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
        updatedAt: true,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedNode),
    }
  } catch (error) {
    console.error('Error editing node:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to edit node',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
