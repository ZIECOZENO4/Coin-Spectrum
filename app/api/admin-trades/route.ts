// app/api/admin/trades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { trades, users } from "@/lib/db/schema";
import { eq, and, lt, sql } from "drizzle-orm";
import { TradeEmail } from "@/emails/AdminTradeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

    // Auto-approve trades older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    await db.transaction(async (tx) => {
      const pendingTrades = await tx
        .select()
        .from(trades)
        .where(
          and(
            eq(trades.status, "active"),
            lt(trades.createdAt, oneHourAgo)
          )
        );

      for (const trade of pendingTrades) {
        await tx
          .update(trades)
          .set({ status: "approved", updatedAt: new Date() })
          .where(eq(trades.id, trade.id));

        const user = await tx
          .select()
          .from(users)
          .where(eq(users.id, trade.userId))
          .then(rows => rows[0]);

        if (user) {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "Trade Auto-Approved",
            react: TradeEmail({
              userName: user.fullName || "User",
              symbol: trade.symbol,
              type: trade.type,
              amount: trade.amount.toString(),
              status: "auto-approved",
              openPrice: trade.openPrice.toString(),
              leverage: trade.leverage.toString()
            })
          });
        }
      }
    });

    const tradesList = await db
      .select({
        trade: trades,
        user: {
          id: users.id,
          email: users.email,
          fullName: users.fullName
        }
      })
      .from(trades)
      .innerJoin(users, eq(trades.userId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(trades.createdAt);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(trades);

    return NextResponse.json({
      trades: tradesList,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tradeId, action } = body;

    const tradeData = await db
      .select({
        trade: trades,
        user: {
          id: users.id,
          email: users.email,
          fullName: users.fullName
        }
      })
      .from(trades)
      .innerJoin(users, eq(trades.userId, users.id))
      .where(eq(trades.id, tradeId))
      .then(rows => rows[0]);

    if (!tradeData) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    await db
      .update(trades)
      .set({
        status: action === "approve" ? "approved" : "rejected",
        updatedAt: new Date()
      })
      .where(eq(trades.id, tradeId));

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: tradeData.user.email,
      subject: `Trade ${action === "approve" ? "Approved" : "Rejected"}`,
      react: TradeEmail({
        userName: tradeData.user.fullName || "User",
        symbol: tradeData.trade.symbol,
        type: tradeData.trade.type,
        amount: tradeData.trade.amount.toString(),
        status: action === "approve" ? "approved" : "rejected",
        openPrice: tradeData.trade.openPrice.toString(),
        leverage: tradeData.trade.leverage.toString()
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing trade:", error);
    return NextResponse.json({ error: "Failed to process trade" }, { status: 500 });
  }
}
