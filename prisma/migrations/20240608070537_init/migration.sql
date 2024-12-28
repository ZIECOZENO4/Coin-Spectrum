-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "InvestmentPlanName" AS ENUM ('VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5', 'VIP6', 'VIP7');

-- CreateEnum
CREATE TYPE "InvestmentStatusEnum" AS ENUM ('PAYMENT_MADE', 'NOT_CONFIRMED', 'CONFIRMED', 'SOLD');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('UNCONFIRMED', 'CONFIRMED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "userName" TEXT,
    "fullName" TEXT,
    "imageUrl" TEXT,
    "accountNumber" TEXT,
    "accountName" TEXT,
    "bankName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "referredById" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTracker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastProfitUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastWithdrawal" TIMESTAMP(3) NOT NULL,
    "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWithdrawal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UserTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentPlan" (
    "id" TEXT NOT NULL,
    "name" "InvestmentPlanName" NOT NULL,
    "peridicProfit" DOUBLE PRECISION NOT NULL,
    "totalProfit" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "profitPercent" DOUBLE PRECISION NOT NULL,
    "rating" INTEGER NOT NULL,
    "principalReturn" BOOLEAN NOT NULL,
    "principalWithdraw" BOOLEAN NOT NULL,
    "creditAmount" DOUBLE PRECISION NOT NULL,
    "depositFee" TEXT NOT NULL,
    "debitAmount" DOUBLE PRECISION NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "startIncrease" BOOLEAN NOT NULL DEFAULT false,
    "dateToStartIncrease" TIMESTAMP(3),
    "planId" TEXT NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentTracker" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "lastProfitUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "InvestmentTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageProof" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ImageProof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentStatus" (
    "id" TEXT NOT NULL,
    "status" "InvestmentStatusEnum" NOT NULL,
    "investmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "investmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "WithdrawalStatus" NOT NULL,
    "accountNumber" TEXT,
    "accountName" TEXT,
    "bankName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referredById_key" ON "User"("referredById");

-- CreateIndex
CREATE UNIQUE INDEX "UserTracker_id_key" ON "UserTracker"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserTracker_userId_key" ON "UserTracker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentPlan_id_key" ON "InvestmentPlan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentPlan_name_key" ON "InvestmentPlan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Investment_id_key" ON "Investment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentTracker_id_key" ON "InvestmentTracker"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentTracker_investmentId_key" ON "InvestmentTracker"("investmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageProof_id_key" ON "ImageProof"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentStatus_id_key" ON "InvestmentStatus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentStatus_investmentId_key" ON "InvestmentStatus"("investmentId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionHistory_id_key" ON "TransactionHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Withdrawal_id_key" ON "Withdrawal"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTracker" ADD CONSTRAINT "UserTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "InvestmentPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentTracker" ADD CONSTRAINT "InvestmentTracker_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageProof" ADD CONSTRAINT "ImageProof_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Investment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentStatus" ADD CONSTRAINT "InvestmentStatus_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
