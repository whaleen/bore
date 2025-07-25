import { Handler } from '@netlify/functions'

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
  const { queryStringParameters, path } = event
  
  try {
    // Check if requesting availability for specific region
    const regionId = path?.split('/').pop()
    if (regionId && regionId !== 'vultr-regions') {
      // Get availability for specific region
      const data = await vultrRequest(`/regions/${regionId}/availability`)
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
        },
        body: JSON.stringify(data),
      }
    }

    // Build query parameters for regions list
    const params = new URLSearchParams()
    
    if (queryStringParameters?.per_page) {
      params.append('per_page', queryStringParameters.per_page)
    }
    if (queryStringParameters?.cursor) {
      params.append('cursor', queryStringParameters.cursor)
    }

    const queryString = params.toString()
    const endpoint = `/regions${queryString ? `?${queryString}` : ''}`
    
    const data = await vultrRequest(endpoint)
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
      body: JSON.stringify(data),
    }
  } catch (error) {
    console.error('Vultr regions function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch regions',
        details: error instanceof Error ? error.message : String(error)
      }),
    }
  }
}