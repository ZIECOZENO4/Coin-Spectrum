// app/api/deposits/check/[transactionId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendingDeposits, transactionHistory } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
      return NextResponse.json(
        { error: "Transaction ID already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json({ exists: false });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check transaction ID" },
      { status: 500 }
    );
  }
}
