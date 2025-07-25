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
  const { queryStringParameters } = event
  
  try {
    // Build query parameters for OS list
    const params = new URLSearchParams()
    
    if (queryStringParameters?.per_page) {
      params.append('per_page', queryStringParameters.per_page)
    }
    if (queryStringParameters?.cursor) {
      params.append('cursor', queryStringParameters.cursor)
    }

    const queryString = params.toString()
    const endpoint = `/os${queryString ? `?${queryString}` : ''}`
    
    const data = await vultrRequest(endpoint)
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours (OS list rarely changes)
      },
      body: JSON.stringify(data),
    }
  } catch (error) {
    console.error('Vultr OS function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch operating systems',
        details: error instanceof Error ? error.message : String(error)
      }),
    }
  }
}