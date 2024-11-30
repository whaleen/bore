/*
  Warnings:

  - You are about to drop the `UserSelectedNode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSelectedNode" DROP CONSTRAINT "UserSelectedNode_nodeId_fkey";

-- DropForeignKey
ALTER TABLE "UserSelectedNode" DROP CONSTRAINT "UserSelectedNode_userId_fkey";

-- DropTable
DROP TABLE "UserSelectedNode";

-- CreateTable
CREATE TABLE "UserSavedNode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSavedNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSavedNode_userId_isPrimary_idx" ON "UserSavedNode"("userId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedNode_userId_nodeId_key" ON "UserSavedNode"("userId", "nodeId");

-- AddForeignKey
ALTER TABLE "UserSavedNode" ADD CONSTRAINT "UserSavedNode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedNode" ADD CONSTRAINT "UserSavedNode_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
