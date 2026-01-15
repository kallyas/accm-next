-- DropIndex
DROP INDEX "idx_email_logs_campaignId";

-- DropIndex
DROP INDEX "idx_email_logs_recipientId";

-- DropIndex
DROP INDEX "idx_marketing_campaigns_createdAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acceptedServiceAgreement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "serviceAgreementAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "serviceAgreementVersion" TEXT DEFAULT '1.0';
