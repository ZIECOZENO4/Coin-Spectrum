// app/api/admin/dashboard/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  users, 
  userInvestments, 
  trades,
  withdrawals,
  userCopyTrades
} from "@/lib/db/schema";
import { sql, and, eq } from "drizzle-orm";

export async function GET() {
  try {
    const [
      usersCount,
      investorsCount,
      tradersCount,
      financialStats,
      investmentData,
      tradingData
    ] = await Promise.all([
      // Total users
      db.select({
        count: sql<number>`cast(count(*) as integer)`
      })
      .from(users)
      .execute(),
      
      // Total investors
      db.select({
        count: sql<number>`cast(count(distinct ${userInvestments.userId}) as integer)`
      })
      .from(userInvestments)
      .execute(),
      
      // Total traders
      db.select({
        count: sql<number>`cast(count(distinct ${trades.userId}) as integer)`
      })
      .from(trades)
      .execute(),
      
      // Financial stats
      db.select({
        deposits: sql<number>`coalesce(sum(case when type = 'deposit' then amount else 0 end), 0)`,
        withdrawals: sql<number>`coalesce(sum(case when type = 'withdrawal' then amount else 0 end), 0)`
      })
      .from(withdrawals)
      .execute(),

      // Investment data for chart
      db.select({
        total: sql<number>`cast(sum(${userInvestments.amount}) as float)`,
        date: sql<string>`date_trunc('day', ${userInvestments.createdAt})`
      })
      .from(userInvestments)
      .groupBy(sql`date_trunc('day', ${userInvestments.createdAt})`)
      .orderBy(sql`date_trunc('day', ${userInvestments.createdAt})`)
      .limit(30)
      .execute(),

      // Trading data for chart
      db.select({
        total: sql<number>`cast(sum(${trades.amount}) as float)`,
        date: sql<string>`date_trunc('day', ${trades.createdAt})`
      })
      .from(trades)
      .groupBy(sql`date_trunc('day', ${trades.createdAt})`)
      .orderBy(sql`date_trunc('day', ${trades.createdAt})`)
      .limit(30)
      .execute()
    ]);

    const netProfit = Number(financialStats[0]?.deposits || 0) - 
                     Number(financialStats[0]?.withdrawals || 0);

    const chartData = investmentData.map((inv, index) => ({
      name: new Date(inv.date).toLocaleDateString(),
      investments: Number(inv.total || 0),
      trades: Number(tradingData[index]?.total || 0)
    }));

    return NextResponse.json({
      statistics: {
        totalUsers: Number(usersCount[0]?.count || 0),
        totalInvestors: Number(investorsCount[0]?.count || 0),
        totalTraders: Number(tradersCount[0]?.count || 0),
        netProfit
      },
      chartData
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" }, 
      { status: 500 }
    );
  }
}
