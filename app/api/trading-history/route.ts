"use client"

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trades, signalPurchases, userCopyTrades, users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { desc, eq } from "drizzle-orm";

// Define types for the query results
interface TradeResult {
  id: string;
  symbol: string;
  amount: number;
  createdAt: Date;
  status: string;
  leverage: number;
  profit: number | null;
}

interface SignalResult {
  id: string;
  amount: number;
  purchasedAt: Date;
  status: string;
  expiresAt: Date;
  signal: {
    name: string;
  };
}

interface CopyTradeResult {
  id: string;
  amount: number;
  createdAt: Date;
  status: string;
  trader: {
    name: string;
  };
}

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userTrades = await db.query.trades.findMany({
      where: eq(trades.userId, session.user.id),
      orderBy: [desc(trades.createdAt)],
    }) as TradeResult[];

    const signalTrades = await db.query.signalPurchases.findMany({
      where: eq(signalPurchases.userId, session.user.id),
      with: {
        signal: true,
      },
      orderBy: [desc(signalPurchases.purchasedAt)],
    }) as SignalResult[];

    const copyTrades = await db.query.userCopyTrades.findMany({
      where: eq(userCopyTrades.userId, session.user.id),
      with: {
        trader: true,
      },
      orderBy: [desc(userCopyTrades.createdAt)],
    }) as CopyTradeResult[];

    const allTrades = [
      ...userTrades.map(trade => ({
        id: trade.id,
        type: 'TRADE' as const,
        pair: trade.symbol,
        amount: trade.amount,
        timestamp: trade.createdAt,
        status: trade.status,
        leverage: trade.leverage.toString(),
        profit: trade.profit,
      })),
      ...signalTrades.map(signal => ({
        id: signal.id,
        type: 'SIGNAL' as const,
        pair: signal.signal.name,
        amount: signal.amount,
        timestamp: signal.purchasedAt,
        status: signal.status,
        expiresAt: signal.expiresAt,
      })),
      ...copyTrades.map(copy => ({
        id: copy.id,
        type: 'COPY' as const,
        pair: copy.trader.name,
        amount: copy.amount,
        timestamp: copy.createdAt,
        status: copy.status,
      }))
    ].sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json(allTrades);
  } catch (error) {
    console.error("Failed to fetch trading history:", error);
    return NextResponse.json(
      { error: "Failed to fetch trading history" },
      { status: 500 }
    );
  }
}
