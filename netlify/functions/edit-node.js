// netlify/functions/edit-node.js
import prisma from './prisma'
const prisma = new PrismaClient();

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const { nodeId, node } = JSON.parse(event.body);

    // Check if the node exists
    const existingNode = await prisma.node.findUnique({
      where: { id: nodeId },
    });

    if (!existingNode) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Node not found' }),
      };
    }

    // Update the node
    const updatedNode = await prisma.node.update({
      where: { id: nodeId },
      data: {
        name: node.name,
        country: node.country,
        countryCode: node.countryCode,
        ipAddress: node.ipAddress,
        protocol: node.protocol,
        port: node.port,
        username: node.username,
        password: node.password,
        region: node.region,
        supportsUDP: node.supportsUDP,
        notes: node.notes,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedNode),
    };
  } catch (error) {
    console.error('Error editing node:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to edit node', details: error.message }),
    };
  }
};
