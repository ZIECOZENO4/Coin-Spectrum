/*
  Warnings:

  - A unique constraint covering the columns `[planType]` on the table `InvestmentPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "InvestmentPlanName" AS ENUM ('BASIC_PLAN', 'SILVER_PLAN', 'GOLDEN_PLAN', 'AMBASSADORSHIP_PLAN', 'PLATINUM', 'VIP_PLAN', 'REAL_ESTATE_PLAN', 'MINING_PLAN', 'PERSONAL_LOAN_PACKAGE', 'BUSINESS_LOAN_PACKAGE', 'MORTGAGE_LOAN_PACKAGE');

-- AlterTable
ALTER TABLE "InvestmentPlan" ADD COLUMN     "planType" "InvestmentPlanName";

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentPlan_planType_key" ON "InvestmentPlan"("planType");
