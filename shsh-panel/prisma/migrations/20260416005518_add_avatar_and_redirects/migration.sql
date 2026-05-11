-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "redirectEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "redirectUrl" TEXT,
ADD COLUMN     "sellerAvatar" TEXT;
