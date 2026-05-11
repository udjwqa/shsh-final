-- AlterTable
ALTER TABLE "Settings" ADD COLUMN "banksGloballyEnabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL DEFAULT '',
    "urlTemplate" TEXT NOT NULL DEFAULT '',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "maintenance" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bank_slug_key" ON "Bank"("slug");

-- CreateTable
CREATE TABLE "BankSubmission" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "listingId" TEXT,
    "step" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '',
    "userAgent" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BankSubmission_bankId_createdAt_idx" ON "BankSubmission"("bankId", "createdAt");

-- CreateIndex
CREATE INDEX "BankSubmission_listingId_idx" ON "BankSubmission"("listingId");

-- AddForeignKey
ALTER TABLE "BankSubmission" ADD CONSTRAINT "BankSubmission_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
