// "use client"

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { trades, signalPurchases, userCopyTrades, users } from "@/lib/db/schema";
// import { getUserAuth } from "@/lib/auth/utils";
// import { desc, eq } from "drizzle-orm";

// // Define types for the query results
// interface TradeResult {
//   id: string;
//   symbol: string;
//   amount: number;
//   createdAt: Date;
//   status: string;
//   leverage: number;
//   profit: number | null;
// }

// interface SignalResult {
//   id: string;
//   amount: number;
//   purchasedAt: Date;
//   status: string;
//   expiresAt: Date;
//   signal: {
//     name: string;
//   };
// }

// interface CopyTradeResult {
//   id: string;
//   amount: number;
//   createdAt: Date;
//   status: string;
//   trader: {
//     name: string;
//   };
// }

// export const dynamic = 'force-dynamic'

// export async function GET(req: NextRequest) {
//   try {
//     const { session } = await getUserAuth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userTrades = await db.query.trades.findMany({
//       where: eq(trades.userId, session.user.id),
//       orderBy: [desc(trades.createdAt)],
//     }) as TradeResult[];

//     const signalTrades = await db.query.signalPurchases.findMany({
//       where: eq(signalPurchases.userId, session.user.id),
//       with: {
//         signal: true,
//       },
//       orderBy: [desc(signalPurchases.purchasedAt)],
//     }) as SignalResult[];

//     const copyTrades = await db.query.userCopyTrades.findMany({
//       where: eq(userCopyTrades.userId, session.user.id),
//       with: {
//         trader: true,
//       },
//       orderBy: [desc(userCopyTrades.createdAt)],
//     }) as CopyTradeResult[];

//     const allTrades = [
//       ...userTrades.map(trade => ({
//         id: trade.id,
//         type: 'TRADE' as const,
//         pair: trade.symbol,
//         amount: trade.amount,
//         timestamp: trade.createdAt,
//         status: trade.status,
//         leverage: trade.leverage.toString(),
//         profit: trade.profit,
//       })),
//       ...signalTrades.map(signal => ({
//         id: signal.id,
//         type: 'SIGNAL' as const,
//         pair: signal.signal.name,
//         amount: signal.amount,
//         timestamp: signal.purchasedAt,
//         status: signal.status,
//         expiresAt: signal.expiresAt,
//       })),
//       ...copyTrades.map(copy => ({
//         id: copy.id,
//         type: 'COPY' as const,
//         pair: copy.trader.name,
//         amount: copy.amount,
//         timestamp: copy.createdAt,
//         status: copy.status,
//       }))
//     ].sort((a, b) => {
//       const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
//       const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
//       return dateB - dateA;
//     });

//     return NextResponse.json(allTrades);
//   } catch (error) {
//     console.error("Failed to fetch trading history:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch trading history" },
//       { status: 500 }
//     );
//   }
// }


// app/api/trading-history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trades, signalPurchases, userCopyTrades } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { desc, eq } from "drizzle-orm";

// Remove "use client" as it's not needed for API routes

interface TradeResult {
  id: string;
  symbol: string;
  amount: number;
  createdAt: Date;
  status: string;
  leverage: number;
  profit: number | null;
  openPrice: number;
  closePrice: number | null;
  type: string;
}

interface SignalResult {
  id: string;
  amount: number;
  purchasedAt: Date;
  status: string;
  expiresAt: Date;
  signal: {
    name: string;
    price: number;
    percentage: number;
    risk: string;
  };
}

interface CopyTradeResult {
  id: string;
  amount: number;
  createdAt: Date;
  status: string;
  trader: {
    name: string;
    percentageProfit: number;
    rating: number;
    isPro: boolean;
  };
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Optional: Use edge runtime for better performance

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
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
      }),
      db.query.signalPurchases.findMany({
        where: eq(signalPurchases.userId, session.user.id),
        with: {
          signal: {
            columns: {
              name: true,
              price: true,
              percentage: true,
              risk: true
            }
          }
        },
        orderBy: [desc(signalPurchases.purchasedAt)],
      }),
      db.query.userCopyTrades.findMany({
        where: eq(userCopyTrades.userId, session.user.id),
        with: {
          trader: {
            columns: {
              name: true,
              percentageProfit: true,
              rating: true,
              isPro: true
            }
          }
        },
        orderBy: [desc(userCopyTrades.createdAt)],
      })
    ]);

    const allTrades = [
        ...userTrades.map(trade => ({
          id: trade.id,
          type: 'TRADE' as const,
          pair: trade.symbol,
          amount: trade.amount,
          timestamp: trade.createdAt,
          status: trade.status,
          leverage: trade.leverage?.toString() ?? "1",
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
          traderInfo: {
            profit: copy.trader.percentageProfit,
            rating: copy.trader.rating,
            isPro: copy.trader.isPro
          }
        }))
      ].sort((a, b) => {
        const dateA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
        const dateB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
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
