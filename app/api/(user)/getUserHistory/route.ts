
import { getUserId } from "./../../../../lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactionHistory } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = getUserId();
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;
    const transactions = await db
      .select()
      .from(transactionHistory)
      .where(eq(transactionHistory.userId, userId))
      .orderBy(desc(transactionHistory.createdAt))
      .limit(pageSize)
      .offset(skip);
    const totalTransactionsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactionHistory)
      .where(eq(transactionHistory.userId, userId));

    const totalTransactions = totalTransactionsResult[0].count;
    const totalPages = Math.ceil(totalTransactions / pageSize);
    return NextResponse.json({ transactions, totalPages });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const revalidate = 0;

