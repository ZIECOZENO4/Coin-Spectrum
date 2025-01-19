// app/api/deposits/check/[transactionId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendingDeposits, transactionHistory } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = params;

    // Check if transaction ID exists in either table
    const existingTransaction = await db.query.transactionHistory.findFirst({
      where: eq(transactionHistory.id, transactionId)
    });

    const existingPendingDeposit = await db.query.pendingDeposits.findFirst({
      where: eq(pendingDeposits.id, `pd_${transactionId}`)
    });

    if (existingTransaction || existingPendingDeposit) {
      // Generate new transaction ID if exists
      const newTransactionId = generateUniqueTransactionId();
      return NextResponse.json({ 
        exists: true, 
        newTransactionId 
      });
    }

    return NextResponse.json({ exists: false });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check transaction ID" },
      { status: 500 }
    );
  }
}

// Helper function to generate unique transaction ID
function generateUniqueTransactionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `tx_${timestamp}_${random}`;
}
