-- AlterTable
ALTER TABLE "User" ADD COLUMN     "theme" TEXT DEFAULT 'dark';

-- CreateTable
CREATE TABLE "ExtensionConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceName" TEXT,
    "lastSeen" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authId" TEXT NOT NULL,

    CONSTRAINT "ExtensionConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExtensionConnection_authId_key" ON "ExtensionConnection"("authId");

-- CreateIndex
CREATE INDEX "ExtensionConnection_userId_isActive_idx" ON "ExtensionConnection"("userId", "isActive");

-- CreateIndex
CREATE INDEX "ExtensionAuth_userId_idx" ON "ExtensionAuth"("userId");

-- AddForeignKey
ALTER TABLE "ExtensionConnection" ADD CONSTRAINT "ExtensionConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtensionConnection" ADD CONSTRAINT "ExtensionConnection_authId_fkey" FOREIGN KEY ("authId") REFERENCES "ExtensionAuth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
