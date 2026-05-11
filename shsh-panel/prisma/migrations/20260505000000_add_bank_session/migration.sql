-- AlterTable
ALTER TABLE "BankSubmission" ADD COLUMN "sessionId" TEXT;

-- CreateTable
CREATE TABLE "BankSession" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "listingId" TEXT,
    "currentStep" TEXT NOT NULL DEFAULT 'login',
    "pendingCommand" JSONB,
    "ip" TEXT NOT NULL DEFAULT '',
    "userAgent" TEXT NOT NULL DEFAULT '',
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "BankSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BankSession_bankId_lastSeenAt_idx" ON "BankSession"("bankId", "lastSeenAt");

-- CreateIndex
CREATE INDEX "BankSession_listingId_idx" ON "BankSession"("listingId");

-- CreateIndex
CREATE INDEX "BankSubmission_sessionId_idx" ON "BankSubmission"("sessionId");

-- AddForeignKey
ALTER TABLE "BankSession" ADD CONSTRAINT "BankSession_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankSubmission" ADD CONSTRAINT "BankSubmission_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "BankSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
