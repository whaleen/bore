-- AlterTable
ALTER TABLE "Node" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "protocol" DROP NOT NULL;