/*
  Warnings:

  - The values [PLATINUM] on the enum `InvestmentPlanName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvestmentPlanName_new" AS ENUM ('BASIC_PLAN', 'SILVER_PLAN', 'GOLDEN_PLAN', 'AMBASSADORSHIP_PLAN', 'PLATINUM_PLAN', 'VIP_PLAN', 'REAL_ESTATE_PLAN', 'MINING_PLAN', 'PERSONAL_LOAN_PACKAGE', 'BUSINESS_LOAN_PACKAGE', 'MORTGAGE_LOAN_PACKAGE');
ALTER TABLE "InvestmentPlan" ALTER COLUMN "planType" TYPE "InvestmentPlanName_new" USING ("planType"::text::"InvestmentPlanName_new");
ALTER TYPE "InvestmentPlanName" RENAME TO "InvestmentPlanName_old";
ALTER TYPE "InvestmentPlanName_new" RENAME TO "InvestmentPlanName";
DROP TYPE "InvestmentPlanName_old";
COMMIT;
