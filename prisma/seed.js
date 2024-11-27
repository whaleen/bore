// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker'; // Corrected to use @faker-js/faker
const prisma = new PrismaClient();

// Available protocols
const protocols = ['HTTP', 'HTTPS', 'SOCKS5'];

// Function to get a random protocol
const randomProtocol = () => protocols[Math.floor(Math.random() * protocols.length)];

// Function to generate a random port number
const randomPort = () => {
  // Random port number between 1024 and 65535
  return Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
};

// Function to generate random supportsUDP (boolean)
const randomSupportsUDP = () => Math.random() < 0.5;

// Seeding function to create nodes
const seedNodes = async () => {
  const nodeCount = 10; // Number of nodes to create, adjust as needed
  for (let i = 0; i < nodeCount; i++) {
    const nodeData = {
      name: faker.internet.domainWord(),
      country: faker.location.country(),
      countryCode: faker.location.countryCode(),
      ipAddress: faker.internet.ip(),
      protocol: randomProtocol(),
      port: randomPort(),
      region: faker.location.state(),
      supportsUDP: randomSupportsUDP(),
      isActive: randomSupportsUDP(),
      notes: faker.lorem.sentence(),
    };

    await prisma.node.create({
      data: nodeData,
    });

    console.log(`Node ${i + 1} created:`, nodeData);
  }
};

// Seed function
const seed = async () => {
  try {
    await seedNodes();
    console.log('Seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
