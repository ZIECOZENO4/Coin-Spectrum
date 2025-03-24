
// import { db } from "@/lib/db";
// import { trades, users } from "@/lib/db/schema";
// import { eq, sql } from "drizzle-orm";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = 10;
//     const offset = (page - 1) * limit;

//     // Fetch trades with user information
//     const tradesData = await db
//       .select({
//         trade: trades,
//         user: {
//           id: users.id,
//           fullName: users.fullName,
//           email: users.email
//         }
//       })
//       .from(trades)
//       .leftJoin(users, eq(trades.userId, users.id))
//       .limit(limit)
//       .offset(offset)
//       .orderBy(sql`${trades.createdAt} desc`);

//     // Get total count for pagination
//     const totalCount = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(trades);

//     return NextResponse.json({
//       trades: tradesData,
//       totalPages: Math.ceil(totalCount[0].count / limit),
//       currentPage: page
//     });
//   } catch (error) {
//     console.error("Error fetching trades:", error);
//     return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { tradeId, action } = body;

//     if (!tradeId || !action) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Update trade status based on action
//     await db
//       .update(trades)
//       .set({
//         status: action === "win" ? "completed" : "loss",
//         updatedAt: new Date()
//       })
//       .where(eq(trades.id, tradeId));

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error processing trade:", error);
//     return NextResponse.json({ error: "Failed to process trade" }, { status: 500 });
//   }
// }


import { db } from "@/lib/db";
import { trades, users, transactionHistory } from "@/lib/db/schema";
import { eq, sql, and, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
// import { Duration } from "luxon";

// Utility function to process expired trades
async function processExpiredTrades() {
  try {
    await db.transaction(async (tx) => {
      // Get current timestamp in database timezone
      const now = sql`now()`;

      // Update expired trades using interval calculation
      const expiredTrades = await tx
        .update(trades)
        .set({
          status: "completed",
          updatedAt: new Date(),
          profit: sql`${trades.amount} * ${trades.leverage}`,
          closePrice: sql`${trades.openPrice}`
        })
        .where(
          and(
            eq(trades.status, "active"),
            lt(
              sql`${trades.createdAt} + ${trades.expiry}::interval`,
              now
            )
          )
        )
        .returning();

      // Update user balances and create transactions
      for (const trade of expiredTrades) {
        const profit = Number(trade.amount) * Number(trade.leverage);
        const totalReturn = profit + Number(trade.amount);

        // Update user balance
        await tx
          .update(users)
          .set({
            balance: sql`${users.balance} + ${totalReturn}`
          })
          .where(eq(users.id, trade.userId));

        // Create transaction record
        await tx.insert(transactionHistory).values({
          id: crypto.randomUUID(),
          userId: trade.userId,
          type: "investment",
          amount: totalReturn,
          description: `Trade ${trade.id} settlement`
        });
      }
    });
  } catch (error) {
    console.error("Error processing expired trades:", error);
  }
}

export async function GET(req: Request) {
  try {
    // Process expired trades before fetching data
    await processExpiredTrades();

    // Pagination setup
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

    // Fetch trades with user data
    const tradesData = await db
      .select({
        trade: trades,
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email
        }
      })
      .from(trades)
      .leftJoin(users, eq(trades.userId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${trades.createdAt} desc`);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(trades);

    return NextResponse.json({
      trades: tradesData,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tradeId, action } = body;

    if (!tradeId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.transaction(async (tx) => {
      // Fetch trade data
      const [trade] = await tx
        .select()
        .from(trades)
        .where(eq(trades.id, tradeId));

      if (!trade) {
        throw new Error("Trade not found");
      }

      // Calculate profit/loss
      let profit = 0;
      let balanceUpdate = 0;
      const amount = Number(trade.amount);
      const leverage = Number(trade.leverage);

      if (action === "win") {
        profit = amount * leverage;
        balanceUpdate = profit + amount;
      } else if (action === "loss") {
        const totalPosition = amount * leverage;
        const loss = totalPosition - amount;
        profit = -loss;
        balanceUpdate = -loss;
      } else {
        throw new Error("Invalid action");
      }

      // Update trade status
      await tx
        .update(trades)
        .set({
          status: action === "win" ? "completed" : "loss",
          profit: profit,
          updatedAt: new Date(),
          closePrice: sql`${trades.openPrice}`
        })
        .where(eq(trades.id, tradeId));

      // Update user balance
      await tx
        .update(users)
        .set({
          balance: sql`${users.balance} + ${balanceUpdate}`
        })
        .where(eq(users.id, trade.userId));

      // Create transaction record
      await tx.insert(transactionHistory).values({
        id: crypto.randomUUID(),
        userId: trade.userId,
        type: "investment",
        amount: balanceUpdate,
        description: `Trade ${tradeId} ${action} settlement`
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error processing trade:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process trade" },
      { status: 500 }
    );
  }
}
