/*
  Warnings:

  - You are about to drop the column `peridicProfit` on the `InvestmentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `accountName` on the `Withdrawal` table. All the data in the column will be lost.
  - You are about to drop the column `accountNumber` on the `Withdrawal` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `Withdrawal` table. All the data in the column will be lost.
  - Added the required column `email` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletPaidInto` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyProfit` to the `InvestmentPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodicProfit` to the `InvestmentPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cryptoType` to the `Withdrawal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletAddress` to the `Withdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Wallets" AS ENUM ('BTC', 'DOGE', 'BCH', 'LTC', 'ETH', 'USDT');

-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT NOT NULL,
ADD COLUMN     "walletPaidInto" "Wallets" NOT NULL;

-- AlterTable
ALTER TABLE "InvestmentPlan" DROP COLUMN "peridicProfit",
ADD COLUMN     "dailyProfit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "periodicProfit" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "UserTracker" ADD COLUMN     "withdrawableBalance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Withdrawal" DROP COLUMN "accountName",
DROP COLUMN "accountNumber",
DROP COLUMN "bankName",
ADD COLUMN     "cryptoType" "Wallets" NOT NULL,
ADD COLUMN     "walletAddress" TEXT NOT NULL;
