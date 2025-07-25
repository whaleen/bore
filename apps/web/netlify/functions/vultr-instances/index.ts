import { Handler } from '@netlify/functions'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const VULTR_API_BASE = 'https://api.vultr.com/v2'
const VULTR_API_KEY = process.env.VULTR_API_KEY

if (!VULTR_API_KEY) {
  console.error('VULTR_API_KEY environment variable is required')
}

async function vultrRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${VULTR_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${VULTR_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Vultr API error: ${response.status} ${errorText}`)
  }

  return response.json()
}

export const handler: Handler = async (event, context) => {
  const { httpMethod, path, body, queryStringParameters } = event
  const userId = queryStringParameters?.userId

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'userId is required' }),
    }
  }

  try {
    switch (httpMethod) {
      case 'GET':
        // List user's instances
        const userInstances = await prisma.vultrInstance.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        })

        // Fetch current status from Vultr for each instance
        const instancesWithStatus = await Promise.all(
          userInstances.map(async (instance) => {
            try {
              const vultrData = await vultrRequest(`/instances/${instance.vultrId}`)
              return {
                ...instance,
                status: vultrData.instance.status,
                powerStatus: vultrData.instance.power_status,
                mainIp: vultrData.instance.main_ip,
              }
            } catch (error) {
              console.error(`Error fetching instance ${instance.vultrId}:`, error)
              return instance
            }
          })
        )

        return {
          statusCode: 200,
          body: JSON.stringify({ instances: instancesWithStatus }),
        }

      case 'POST':
        // Create new instance
        const createData = JSON.parse(body || '{}')
        const { region, plan, osId, label, sshKeyIds, userData } = createData

        if (!region || !plan || !osId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'region, plan, and osId are required' }),
          }
        }

        // Create instance via Vultr API
        const instancePayload: any = {
          region,
          plan,
          os_id: osId,
          label: label || `Bore Node ${Date.now()}`,
        }

        if (sshKeyIds?.length) {
          instancePayload.sshkey_id = sshKeyIds
        }

        if (userData) {
          instancePayload.user_data = Buffer.from(userData).toString('base64')
        }

        const vultrResponse = await vultrRequest('/instances', {
          method: 'POST',
          body: JSON.stringify(instancePayload),
        })

        // Save to database
        const dbInstance = await prisma.vultrInstance.create({
          data: {
            vultrId: vultrResponse.instance.id,
            userId,
            label: vultrResponse.instance.label,
            region: vultrResponse.instance.region,
            plan: vultrResponse.instance.plan,
            osId: vultrResponse.instance.os_id,
            status: vultrResponse.instance.status,
            powerStatus: vultrResponse.instance.power_status || 'pending',
            mainIp: vultrResponse.instance.main_ip || null,
            internalIp: vultrResponse.instance.internal_ip || null,
            defaultPassword: vultrResponse.instance.default_password || null,
          },
        })

        return {
          statusCode: 201,
          body: JSON.stringify({ 
            instance: dbInstance,
            vultrData: vultrResponse.instance 
          }),
        }

      case 'DELETE':
        // Delete instance
        const instanceId = path?.split('/').pop()
        if (!instanceId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Instance ID is required' }),
          }
        }

        // Find instance in database
        const instanceToDelete = await prisma.vultrInstance.findFirst({
          where: { id: instanceId, userId },
        })

        if (!instanceToDelete) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Instance not found' }),
          }
        }

        // Delete from Vultr
        await vultrRequest(`/instances/${instanceToDelete.vultrId}`, {
          method: 'DELETE',
        })

        // Delete from database
        await prisma.vultrInstance.delete({
          where: { id: instanceId },
        })

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Instance deleted successfully' }),
        }

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' }),
        }
    }
  } catch (error) {
    console.error('Vultr instances function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }),
    }
  } finally {
    await prisma.$disconnect()
  }
}