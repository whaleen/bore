/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserSavedNode` table. All the data in the column will be lost.
  - You are about to drop the `ExtensionAuth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExtensionConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userDeployedNode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExtensionAuth" DROP CONSTRAINT "ExtensionAuth_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExtensionConnection" DROP CONSTRAINT "ExtensionConnection_authId_fkey";

-- DropForeignKey
ALTER TABLE "ExtensionConnection" DROP CONSTRAINT "ExtensionConnection_userId_fkey";

-- DropForeignKey
ALTER TABLE "userDeployedNode" DROP CONSTRAINT "userDeployedNode_nodeId_fkey";

-- DropForeignKey
ALTER TABLE "userDeployedNode" DROP CONSTRAINT "userDeployedNode_userId_fkey";

-- AlterTable
ALTER TABLE "UserSavedNode" DROP COLUMN "createdAt",
ADD COLUMN     "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "ExtensionAuth";

-- DropTable
DROP TABLE "ExtensionConnection";

-- DropTable
DROP TABLE "userDeployedNode";

-- CreateTable
CREATE TABLE "UserDeployedNode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "deployedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDeployedNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL DEFAULT 'CHROME_EXTENSION',
    "deviceName" TEXT,
    "lastSeen" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authId" TEXT NOT NULL,

    CONSTRAINT "DeviceConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceAuth" (
    "id" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsed" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDeployedNode_userId_nodeId_key" ON "UserDeployedNode"("userId", "nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceConnection_authId_key" ON "DeviceConnection"("authId");

-- CreateIndex
CREATE INDEX "DeviceConnection_userId_isActive_idx" ON "DeviceConnection"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceAuth_apiKey_key" ON "DeviceAuth"("apiKey");

-- CreateIndex
CREATE INDEX "DeviceAuth_userId_idx" ON "DeviceAuth"("userId");

-- AddForeignKey
ALTER TABLE "UserDeployedNode" ADD CONSTRAINT "UserDeployedNode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDeployedNode" ADD CONSTRAINT "UserDeployedNode_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceConnection" ADD CONSTRAINT "DeviceConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceConnection" ADD CONSTRAINT "DeviceConnection_authId_fkey" FOREIGN KEY ("authId") REFERENCES "DeviceAuth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceAuth" ADD CONSTRAINT "DeviceAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
