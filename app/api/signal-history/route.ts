// app/api/signal-history/route.ts
import { db } from "@/lib/db";
import { signalPurchases, tradingSignals } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const signalHistory = await db
      .select({
        purchase: signalPurchases,
        signal: tradingSignals
      })
      .from(signalPurchases)
      .leftJoin(
        tradingSignals,
        eq(signalPurchases.signalId, tradingSignals.id)
      )
      .where(eq(signalPurchases.userId, userId))
      .orderBy(signalPurchases.purchasedAt);

    return NextResponse.json(signalHistory);
  } catch (error) {
    console.error("Error fetching signal history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
