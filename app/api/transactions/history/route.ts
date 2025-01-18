// app/api/transactions/history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactionHistory, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ transactions: [] });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

    const transactions = await db
      .select()
      .from(transactionHistory)
      .where(eq(transactionHistory.userId, userId))
      .orderBy(desc(transactionHistory.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      transactions: transactions || [], // Ensure we always return an array
      totalPages: Math.ceil((transactions?.length || 0) / limit),
      currentPage: page
    });

  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ 
      transactions: [],
      totalPages: 0,
      currentPage: 1
    });
  }
}
