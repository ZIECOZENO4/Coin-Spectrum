// app/api/user-copy-trades/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userCopyTrades, traders } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq, and, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const copyTrades = await db
      .select({
        copyTrade: {
          id: userCopyTrades.id,
          amount: userCopyTrades.amount,
          status: userCopyTrades.status,
          createdAt: userCopyTrades.createdAt,
        },
        trader: {
          name: traders.name,
          percentageProfit: traders.percentageProfit,
          totalProfit: traders.totalProfit,
          rating: traders.rating,
        }
      })
      .from(userCopyTrades)
      .where(eq(userCopyTrades.userId, session.user.id))
      .leftJoin(traders, eq(userCopyTrades.traderId, traders.id))
      .orderBy(desc(userCopyTrades.createdAt));

    return NextResponse.json(copyTrades);

  } catch (error) {
    console.error("Failed to fetch copy trades:", error);
    return NextResponse.json(
      { error: "Failed to fetch copy trades" },
      { status: 500 }
    );
  }
}
