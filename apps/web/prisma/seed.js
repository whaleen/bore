const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const { getCode, getName } = require('country-list');

var generate = require('boring-name-generator');
generate({ number: true }).dashed;

const prisma = new PrismaClient();

const protocols = ['HTTP', 'HTTPS', 'SOCKS5'];
const randomProtocol = () => protocols[Math.floor(Math.random() * protocols.length)];

function generateFakeSolanaAddress() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
  let fakeAddy = '1';
  for (let i = 0; i < 31; i++) {
    fakeAddy += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return fakeAddy;
}

const randomPort = () => Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
const randomSupportsUDP = () => Math.random() < 0.5;

const seedNodes = async () => {
  const nodeCount = 10;
  for (let i = 0; i < nodeCount; i++) {
    const countryCode = faker.location.countryCode();
    const country = getName(countryCode);

    const nodeData = {
      name: generate({ number: true }).dashed, // Updated to use boring-name-generator
      country,
      countryCode,
      ipAddress: faker.internet.ip(),
      protocol: randomProtocol(),
      port: randomPort(),
      region: 'Earth',
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
