// app/api/admin/copy-trades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { userCopyTrades, traders, users } from "@/lib/db/schema";
import { eq, and, lt, sql } from "drizzle-orm";
import { CopyTradeEmail } from "@/emails/AdminCopyTradeEmail";

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
        .from(userCopyTrades)
        .where(
          and(
            eq(userCopyTrades.status, "active"),
            lt(userCopyTrades.createdAt, oneHourAgo)
          )
        );

      for (const trade of pendingTrades) {
        await tx
          .update(userCopyTrades)
          .set({ status: "approved", updatedAt: new Date() })
          .where(eq(userCopyTrades.id, trade.id));

        const [user, trader] = await Promise.all([
          tx.query.users.findFirst({ where: eq(users.id, trade.userId) }),
          tx.query.traders.findFirst({ where: eq(traders.id, trade.traderId) })
        ]);

        if (user && trader) {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "Copy Trade Auto-Approved",
            react: CopyTradeEmail({
              userFirstName: user.firstName || "User",
              traderName: trader.name,
              amount: trade.amount.toString(),
              status: "auto-approved"
            })
          });
        }
      }
    });

    const copyTrades = await db
      .select({
        trade: userCopyTrades,
        trader: traders,
        user: {
          id: users.id,
          email: users.email,
          fullName: users.fullName
        }
      })
      .from(userCopyTrades)
      .leftJoin(traders, eq(userCopyTrades.traderId, traders.id))
      .leftJoin(users, eq(userCopyTrades.userId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(userCopyTrades.createdAt);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(userCopyTrades);

    return NextResponse.json({
      copyTrades,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching copy trades:", error);
    return NextResponse.json({ error: "Failed to fetch copy trades" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { tradeId, action } = body;
  
      const tradeData = await db
        .select({
          trade: userCopyTrades,
          trader: {
            id: traders.id,
            name: traders.name
          },
          user: {
            id: users.id,
            email: users.email,
            fullName: users.fullName
          }
        })
        .from(userCopyTrades)
        .innerJoin(traders, eq(userCopyTrades.traderId, traders.id))
        .innerJoin(users, eq(userCopyTrades.userId, users.id))
        .where(eq(userCopyTrades.id, tradeId))
        .then(rows => rows[0]);
  
      if (!tradeData) {
        return NextResponse.json({ error: "Trade not found" }, { status: 404 });
      }
  
      await db
        .update(userCopyTrades)
        .set({
          status: action === "approve" ? "approved" : "inactive",
          updatedAt: new Date()
        })
        .where(eq(userCopyTrades.id, tradeId));
  
      // Send email notification
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: tradeData.user.email,
        subject: `Copy Trade ${action === "approve" ? "Approved" : "Rejected"}`,
        react: CopyTradeEmail({
         userFirstName: tradeData.user.fullName || "User", // Changed from userFirstName to userName
          traderName: tradeData.trader.name,
          amount: tradeData.trade.amount.toString(),
          status: action === "approve" ? "approved" : "rejected",
        })
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error processing copy trade:", error);
      return NextResponse.json({ error: "Failed to process copy trade" }, { status: 500 });
    }
  }
  