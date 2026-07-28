-- AlterTable
ALTER TABLE "User" ADD COLUMN     "company" TEXT NOT NULL DEFAULT 'Acme SaaS',
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true;
