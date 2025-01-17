// app/api/trading-history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trades, signalPurchases, userCopyTrades } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { desc, eq } from "drizzle-orm";

interface TradeResult {
  id: string;
  symbol: string;
  amount: number;
  createdAt: Date;
  status: string;
  leverage: number;
  profit: number | null;
  userId: string;
}

interface SignalResult {
  id: string;
  amount: number;
  purchasedAt: Date;
  status: string;
  expiresAt: Date;
  userId: string;
  signal: {
    name: string;
  };
}

interface CopyTradeResult {
  id: string;
  amount: number;
  createdAt: Date;
  status: string;
  userId: string;
  trader: {
    name: string;
  };
}

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const [userTrades, signalTrades, copyTrades] = await Promise.all([
      db.query.trades.findMany({
        where: eq(trades.userId, session.user.id),
        orderBy: [desc(trades.createdAt)],
      }) as Promise<TradeResult[]>,

      db.query.signalPurchases.findMany({
        where: eq(signalPurchases.userId, session.user.id),
        with: {
          signal: true,
        },
        orderBy: [desc(signalPurchases.purchasedAt)],
      }) as Promise<SignalResult[]>,

      db.query.userCopyTrades.findMany({
        where: eq(userCopyTrades.userId, session.user.id),
        with: {
          trader: true,
        },
        orderBy: [desc(userCopyTrades.createdAt)],
      }) as Promise<CopyTradeResult[]>
    ]);

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
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    // Add pagination
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTrades = allTrades.slice(startIndex, endIndex);

    return NextResponse.json({
      trades: paginatedTrades,
      pagination: {
        total: allTrades.length,
        page,
        limit,
        totalPages: Math.ceil(allTrades.length / limit)
      }
    });

  } catch (error) {
    console.error("Failed to fetch trading history:", error);
    return NextResponse.json(
      { error: "Failed to fetch trading history" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, pair, amount, leverage } = body;

    if (!type || !pair || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'TRADE':
        result = await db.insert(trades).values({
          userId: session.user.id,
          symbol: pair,
          amount,
          leverage: leverage || 1,
          status: 'PENDING',
          createdAt: new Date(),
        }).returning();
        break;

      case 'SIGNAL':
        result = await db.insert(signalPurchases).values({
          userId: session.user.id,
          amount,
          status: 'ACTIVE',
          purchasedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        }).returning();
        break;

      case 'COPY':
        result = await db.insert(userCopyTrades).values({
          userId: session.user.id,
          amount,
          status: 'ACTIVE',
          createdAt: new Date(),
        }).returning();
        break;

      default:
        return NextResponse.json(
          { error: "Invalid trade type" },
          { status: 400 }
        );
    }

    return NextResponse.json(result[0]);

  } catch (error) {
    console.error("Failed to create trade:", error);
    return NextResponse.json(
      { error: "Failed to create trade" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, type, status, profit } = body;

    if (!id || !type || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'TRADE':
        result = await db
          .update(trades)
          .set({ status, profit })
          .where(eq(trades.id, id))
          .returning();
        break;

      case 'SIGNAL':
        result = await db
          .update(signalPurchases)
          .set({ status })
          .where(eq(signalPurchases.id, id))
          .returning();
        break;

      case 'COPY':
        result = await db
          .update(userCopyTrades)
          .set({ status })
          .where(eq(userCopyTrades.id, id))
          .returning();
        break;

      default:
        return NextResponse.json(
          { error: "Invalid trade type" },
          { status: 400 }
        );
    }

    return NextResponse.json(result[0]);

  } catch (error) {
    console.error("Failed to update trade:", error);
    return NextResponse.json(
      { error: "Failed to update trade" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { id, type } = await req.json();

    if (!id || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'TRADE':
        result = await db
          .delete(trades)
          .where(eq(trades.id, id))
          .returning();
        break;

      case 'SIGNAL':
        result = await db
          .delete(signalPurchases)
          .where(eq(signalPurchases.id, id))
          .returning();
        break;

      case 'COPY':
        result = await db
          .delete(userCopyTrades)
          .where(eq(userCopyTrades.id, id))
          .returning();
        break;

      default:
        return NextResponse.json(
          { error: "Invalid trade type" },
          { status: 400 }
        );
    }

    return NextResponse.json(result[0]);

  } catch (error) {
    console.error("Failed to delete trade:", error);
    return NextResponse.json(
      { error: "Failed to delete trade" },
      { status: 500 }
    );
  }
}

