// app/api/admin/dashboard/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  users, 
  userInvestments, 
  trades,
  pendingDeposits,
  withdrawals,
  userCopyTrades
} from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const [
      totalUsers,
      totalInvestors,
      totalTraders,
      financialStats,
      investmentData,
      tradingData
    ] = await Promise.all([
      // Get total users
      db.select({ count: sql<number>`count(*)` }).from(users),
      
      // Get total investors (unique users with investments)
      db.select({ count: sql<number>`count(distinct user_id)` }).from(userInvestments),
      
      // Get total traders (unique users with trades or copy trades)
      db.select({ 
        count: sql<number>`count(distinct user_id)` 
      })
      .from(trades)
      .leftJoin(userCopyTrades, sql`true`),
      
      // Get financial statistics
      db.select({
        totalDeposits: sql<number>`COALESCE(sum(amount), 0)`.as('totalDeposits'),
        totalWithdrawals: sql<number>`COALESCE(sum(amount), 0)`.as('totalWithdrawals'),
      }).from(withdrawals),

      // Get investment amounts for chart
      db.select({
        amount: sql<number>`sum(amount)`,
        createdAt: userInvestments.createdAt,
      })
      .from(userInvestments)
      .groupBy(userInvestments.createdAt)
      .orderBy(userInvestments.createdAt)
      .limit(30),

      // Get trading amounts for chart
      db.select({
        amount: sql<number>`sum(amount)`,
        createdAt: trades.createdAt,
      })
      .from(trades)
      .groupBy(trades.createdAt)
      .orderBy(trades.createdAt)
      .limit(30),
    ]);

    const netProfit = (financialStats[0]?.totalDeposits || 0) - 
                     (financialStats[0]?.totalWithdrawals || 0);

    const chartData = investmentData.map((inv, index) => ({
      name: inv.createdAt,
      investments: inv.amount || 0,
      trades: tradingData[index]?.amount || 0,
    }));

    return NextResponse.json({
      statistics: {
        totalUsers: totalUsers[0].count,
        totalInvestors: totalInvestors[0].count,
        totalTraders: totalTraders[0].count,
        netProfit,
      },
      chartData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" }, 
      { status: 500 }
    );
  }
}
