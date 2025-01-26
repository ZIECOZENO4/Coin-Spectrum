// app/api/trades/route.ts
import { db } from "@/lib/db";
import { trades, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

    // Fetch trades with user information
    const tradesData = await db
      .select({
        trade: trades,
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email
        }
      })
      .from(trades)
      .leftJoin(users, eq(trades.userId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${trades.createdAt} desc`);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(trades);

    return NextResponse.json({
      trades: tradesData,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tradeId, action } = body;

    if (!tradeId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update trade status based on action
    await db
      .update(trades)
      .set({
        status: action === "approve" ? "completed" : "rejected",
        updatedAt: new Date()
      })
      .where(eq(trades.id, tradeId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing trade:", error);
    return NextResponse.json({ error: "Failed to process trade" }, { status: 500 });
  }
}
