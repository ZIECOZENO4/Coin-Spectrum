import { TransactionType } from "@prisma/client";
import { prisma } from "./db/prisma";
interface CreateTransactionHistoryProps {
  type: TransactionType;
  amount: number;
  description: string;
  userId: string;
  investmentId?: string;
}

export async function createTransactionHistory({
  type,
  amount,
  description,
  userId,
  investmentId,
}: CreateTransactionHistoryProps) {
  try {
    const transactionHistory = await prisma.transactionHistory.create({
      data: {
        type,
        amount,
        description,
        user: {
          connect: {
            id: userId,
          },
        },
        investment: investmentId
          ? {
              connect: {
                id: investmentId,
              },
            }
          : undefined,
      },
    });

    return transactionHistory;
  } catch (error) {
    console.error("Error creating transaction history:", error);
    throw error;
  }
}
