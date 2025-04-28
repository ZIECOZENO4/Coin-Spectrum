import { db } from "@/lib/db";
import { transactionHistory } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getTransactionById(id: string) {
  try {
    const transaction = await db.query.transactionHistory.findFirst({
      where: eq(transactionHistory.id, id),
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
} 