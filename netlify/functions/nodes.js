const { faker } = require('@faker-js/faker')

function generateFakeNodes(count) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    country: faker.location.country(),
    countryCode: faker.location.countryCode(),
    ipAddress: faker.internet.ip()
  }))
}

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  try {
    const nodes = generateFakeNodes(60)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(nodes)
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate nodes' })
    }
  }
}
