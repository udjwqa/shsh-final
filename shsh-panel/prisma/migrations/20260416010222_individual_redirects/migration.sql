/*
  Warnings:

  - You are about to drop the column `redirectEnabled` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `redirectUrl` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "redirectEnabled",
DROP COLUMN "redirectUrl",
ADD COLUMN     "redirectAuto" TEXT,
ADD COLUMN     "redirectJobs" TEXT,
ADD COLUMN     "redirectMarketplace" TEXT,
ADD COLUMN     "redirectPostListing" TEXT,
ADD COLUMN     "redirectRealEstate" TEXT;
