// app/api/transactions/history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactionHistory, users } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

    const transactions = await db
      .select({
        id: transactionHistory.id,
        type: transactionHistory.type,
        amount: transactionHistory.amount,
        description: transactionHistory.description,
        createdAt: transactionHistory.createdAt,
        investmentId: transactionHistory.investmentId
      })
      .from(transactionHistory)
      .where(eq(transactionHistory.userId, userId))
      .orderBy(desc(transactionHistory.createdAt))
      .limit(limit)
      .offset(offset);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactionHistory)
      .where(eq(transactionHistory.userId, userId));

    return NextResponse.json({
      transactions,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page
    });

  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction history" },
      { status: 500 }
    );
  }
}
