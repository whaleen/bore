// netlify/functions/manage-extension-connection.js
export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const { action, connectionId, userId } = JSON.parse(event.body)

    if (!userId || !connectionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID and connection ID are required' })
      }
    }

    switch (action) {
      case 'revoke':
        await prisma.extensionConnection.update({
          where: { id: connectionId },
          data: { isActive: false }
        })
        break

      case 'update':
        await prisma.extensionConnection.update({
          where: { id: connectionId },
          data: { lastSeen: new Date() }
        })
        break

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    }
  } catch (error) {
    console.error('Error managing extension connection:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to manage extension connection' })
    }
  }
}
