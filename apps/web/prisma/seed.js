// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { getCode, getName } from 'country-list'; // Added import

const prisma = new PrismaClient();

// Available protocols
const protocols = ['HTTP', 'HTTPS', 'SOCKS5'];

// Function to get a random protocol
const randomProtocol = () => protocols[Math.floor(Math.random() * protocols.length)];

function generateFakeSolanaAddress() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
  let fakeAddy = '1';
  for (let i = 0; i < 31; i++) {
    fakeAddy += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return fakeAddy;
}

// Function to generate a random port number
const randomPort = () => {
  // Random port number between 1024 and 65535
  return Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
};

// Function to generate random supportsUDP (boolean)
const randomSupportsUDP = () => Math.random() < 0.5;

// Seeding function to create nodes
const seedNodes = async () => {
  const nodeCount = 10;
  for (let i = 0; i < nodeCount; i++) {
    const countryCode = faker.location.countryCode();
    const country = getName(countryCode);

    const nodeData = {
      name: generateFakeSolanaAddress(), // Use the corrected function
      country,
      countryCode,
      ipAddress: faker.internet.ip(),
      protocol: randomProtocol(),
      port: randomPort(),
      region: 'Earth', // Hardcoded region
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
