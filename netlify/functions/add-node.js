// netlify/functions/add-node.js
import prisma from './prisma'
import ct from 'countries-and-timezones'

// Import the region mapping logic or define it here
const COUNTRY_REGIONS = {
  'US': 'North America',
  'CA': 'North America',
  // ... (same mapping as in location.js)
}

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const { userId, node } = JSON.parse(event.body)

    // Get country data and determine region
    const country = ct.getCountry(node.countryCode)
    if (!country) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid country code' }),
      }
    }

    const region = COUNTRY_REGIONS[node.countryCode] || 'Unknown'

    // Add the node
    const newNode = await prisma.node.create({
      data: {
        name: node.name,
        country: node.country,
        countryCode: node.countryCode,
        ipAddress: node.ipAddress,
        protocol: node.protocol,
        port: parseInt(node.port),
        username: node.username,
        password: node.password,
        region: region,
        supportsUDP: node.supportsUDP,
        notes: node.notes,
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(newNode),
    }
  } catch (error) {
    console.error('Error adding node:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to add node', details: error.message }),
    }
  }
}
