// import { TransactionType } from "@prisma/client";
// import { prisma } from "./db/prisma";
// interface CreateTransactionHistoryProps {
//   type: TransactionType;
//   amount: number;
//   description: string;
//   userId: string;
//   investmentId?: string;
// }

// export async function createTransactionHistory({
//   type,
//   amount,
//   description,
//   userId,
//   investmentId,
// }: CreateTransactionHistoryProps) {
//   try {
//     const transactionHistory = await prisma.transactionHistory.create({
//       data: {
//         type,
//         amount,
//         description,
//         user: {
//           connect: {
//             id: userId,
//           },
//         },
//         investment: investmentId
//           ? {
//               connect: {
//                 id: investmentId,
//               },
//             }
//           : undefined,
//       },
//     });

//     return transactionHistory;
//   } catch (error) {
//     console.error("Error creating transaction history:", error);
//     throw error;
//   }
// }


import { TransactionType } from "@/lib/db/schema"; // Adjust this import path as needed
import { db } from "@/lib/db";
import { transactionHistory } from "@/lib/db/schema";

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
    const newTransactionHistory = await db.insert(transactionHistory).values({
      type,
      amount,
      description,
      userId,
      investmentId: investmentId || null,
    }).returning();

    return newTransactionHistory[0];
  } catch (error) {
    console.error("Error creating transaction history:", error);
    throw error;
  }
}
