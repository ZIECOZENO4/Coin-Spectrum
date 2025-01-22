// app/api/getTrades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trades } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user's trades
    const userTrades = await db.select()
      .from(trades)
      .where(eq(trades.userId, session.user.id))
      .orderBy(trades.createdAt);

    return NextResponse.json({
      success: true,
      trades: userTrades
    });

  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch trades",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
