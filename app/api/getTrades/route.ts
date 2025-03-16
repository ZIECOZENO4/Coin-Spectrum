// app/api/getTrades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trades } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq, sql } from "drizzle-orm";


export async function GET(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tradeCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(trades)
      .where(eq(trades.userId, session.user.id));

    return NextResponse.json({
      success: true,
      tradeCount: Number(tradeCount[0]?.count || 0)
    });

  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return NextResponse.json(
      { error: "Failed to fetch trades" },
      { status: 500 }
    );
  }
}
