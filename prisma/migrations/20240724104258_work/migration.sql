/*
  Warnings:

  - The `name` column on the `InvestmentPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "Wallets" ADD VALUE 'TRX';

-- DropIndex
DROP INDEX "InvestmentPlan_name_key";

-- AlterTable
ALTER TABLE "Investment" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InvestmentPlan" DROP COLUMN "name",
ADD COLUMN     "name" TEXT;

-- DropEnum
DROP TYPE "InvestmentPlanName";
