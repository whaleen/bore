// netlify/functions/manage-extension-connection.js
export const handler = async (event, context) => {
  console.log('Handler invoked with event:', JSON.stringify(event));

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    console.log('Preflight request received');
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    const { action, connectionId, userId } = JSON.parse(event.body);
    console.log('Parsed body:', { action, connectionId, userId });

    if (!userId || !connectionId) {
      console.warn('Missing userId or connectionId');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID and connection ID are required' })
      }
    }

    const authHeader = event.headers.authorization || event.headers.Authorization;
    console.log('Authorization header:', authHeader);
    if (authHeader) {
      const apiKey = authHeader.replace('Bearer ', '');
      console.log('Extracted API key:', apiKey);
      const auth = await prisma.extensionAuth.findFirst({
        where: {
          apiKey,
          userId
        }
      });

      if (!auth) {
        console.warn('Invalid API key for user:', userId);
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid API key' })
        }
      }
    }

    switch (action) {
      case 'revoke': {
        console.log('Revoking connection:', connectionId);
        const connection = await prisma.extensionConnection.findFirst({
          where: {
            id: connectionId,
            userId: userId,
            isActive: true
          },
          include: {
            auth: true
          }
        });

        if (!connection) {
          console.warn('Active connection not found for user:', userId);
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Active connection not found' })
          }
        }

        await prisma.$transaction(async (tx) => {
          // First delete the connection
          await tx.extensionConnection.delete({
            where: { id: connectionId }
          });

          // Then delete the auth record
          await tx.extensionAuth.delete({
            where: { id: connection.auth.id }
          });
        });

        console.log(`Successfully revoked connection ${connectionId} for user ${userId}`);
        break;
      }

      case 'update': {
        await prisma.extensionConnection.update({
          where: {
            id: connectionId,
            userId: userId,
            isActive: true
          },
          data: { lastSeen: new Date() }
        })
        break;
      }

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
      body: JSON.stringify({
        error: 'Failed to manage extension connection',
        details: error.message,
        // Add stack trace in development
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
      })
    }
  }
}
