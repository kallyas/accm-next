-- Unified Migration: Add Marketing System (preserves existing data)
-- This migration only adds the marketing tables without affecting existing data

-- Create marketing_campaigns table if it doesn't exist
CREATE TABLE IF NOT EXISTS "marketing_campaigns" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "recipientType" TEXT NOT NULL,
    "targetRole" "Role",
    "selectedUserIds" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "totalRecipients" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "scheduledDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "marketing_campaigns_pkey" PRIMARY KEY ("id")
);

-- Create email_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS "email_logs" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "recipientId" TEXT,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints only if they don't exist
DO $$
BEGIN
    -- Add foreign key for marketing_campaigns.createdBy -> User.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'marketing_campaigns_createdBy_fkey'
    ) THEN
        ALTER TABLE "marketing_campaigns" 
        ADD CONSTRAINT "marketing_campaigns_createdBy_fkey" 
        FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Add foreign key for email_logs.campaignId -> marketing_campaigns.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'email_logs_campaignId_fkey'
    ) THEN
        ALTER TABLE "email_logs" 
        ADD CONSTRAINT "email_logs_campaignId_fkey" 
        FOREIGN KEY ("campaignId") REFERENCES "marketing_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Add foreign key for email_logs.recipientId -> User.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'email_logs_recipientId_fkey'
    ) THEN
        ALTER TABLE "email_logs" 
        ADD CONSTRAINT "email_logs_recipientId_fkey" 
        FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_marketing_campaigns_createdAt" ON "marketing_campaigns" ("createdAt");
CREATE INDEX IF NOT EXISTS "idx_email_logs_campaignId" ON "email_logs" ("campaignId");
CREATE INDEX IF NOT EXISTS "idx_email_logs_recipientId" ON "email_logs" ("recipientId");