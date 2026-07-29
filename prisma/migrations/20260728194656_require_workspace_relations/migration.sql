/*
  Warnings:

  - Made the column `workspaceId` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workspaceId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workspaceId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "workspaceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "workspaceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "workspaceId" SET NOT NULL;
