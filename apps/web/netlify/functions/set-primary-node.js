// netlify/functions/set-primary-node.js
import prisma from './prisma'

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const { userId, nodeId } = JSON.parse(event.body);
    console.log('Setting primary node for:', { userId, nodeId });

    // Use transaction to update nodes
    const result = await prisma.$transaction(async (tx) => {
      // First set all user's nodes to not primary
      await tx.userSavedNode.updateMany({
        where: {
          userId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });

      // Then set the selected node as primary
      return await tx.userSavedNode.update({
        where: {
          userId_nodeId: {
            userId,
            nodeId,
          },
        },
        data: {
          isPrimary: true,
        },
        include: {
          node: true,
        },
      });
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error setting primary node:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
