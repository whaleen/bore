-- DropForeignKey
ALTER TABLE "ExtensionConnection" DROP CONSTRAINT "ExtensionConnection_authId_fkey";

-- CreateTable
CREATE TABLE "userDeployedNode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userDeployedNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userDeployedNode_userId_nodeId_key" ON "userDeployedNode"("userId", "nodeId");

-- AddForeignKey
ALTER TABLE "userDeployedNode" ADD CONSTRAINT "userDeployedNode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userDeployedNode" ADD CONSTRAINT "userDeployedNode_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtensionConnection" ADD CONSTRAINT "ExtensionConnection_authId_fkey" FOREIGN KEY ("authId") REFERENCES "ExtensionAuth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
