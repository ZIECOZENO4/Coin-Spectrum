
import { getUserId } from "./../../../../lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactionHistory } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  console.log("Received GET request for transactions API");
  const { searchParams } = req.nextUrl;
  const userId = getUserId();
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  console.log("Query parameters:", { userId, page, limit });

  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    console.log(
      `Calculated pagination: pageNumber=${pageNumber}, pageSize=${pageSize}, skip=${skip}`
    );

    console.log("Fetching transactions from database...");
    const transactions = await db
      .select()
      .from(transactionHistory)
      .where(eq(transactionHistory.userId, userId))
      .orderBy(desc(transactionHistory.createdAt))
      .limit(pageSize)
      .offset(skip);

    console.log("Fetched transactions:", transactions);
    console.log("Counting total transactions for pagination...");
    const totalTransactionsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactionHistory)
      .where(eq(transactionHistory.userId, userId));

    const totalTransactions = totalTransactionsResult[0].count;
    const totalPages = Math.ceil(totalTransactions / pageSize);

    console.log("Sending response with transactions and total pages");
    return NextResponse.json({ transactions, totalPages });
  } catch (error) {
    console.error("Error occurred while fetching transactions:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Sending error response with message:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const revalidate = 0;

