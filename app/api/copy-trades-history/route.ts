// app/api/user-copy-trades/route.ts
import { db } from "@/lib/db";
import { userCopyTrades, traders } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const copyTrades = await db
      .select({
        copyTrade: userCopyTrades,
        trader: traders
      })
      .from(userCopyTrades)
      .leftJoin(traders, eq(userCopyTrades.traderId, traders.id))
      .where(eq(userCopyTrades.userId, userId));

    return NextResponse.json(copyTrades);
  } catch (error) {
    console.error("Error fetching copy trades:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
