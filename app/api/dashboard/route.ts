// app/api/admin/dashboard/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { sql, eq, and } from "drizzle-orm";
import { 
  users, 
  userInvestments, 
  trades,
  transactionHistory
} from "@/lib/db/schema";

interface ChartDataPoint {
  name: string;
  investments: number;
  trades: number;
  sales: number;
}

interface DashboardStatistics {
  totalUsers: number;
  totalInvestors: number;
  totalTraders: number;
  netProfit: number;
}

interface DashboardResponse {
  statistics: DashboardStatistics;
  chartData: ChartDataPoint[];
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const adminUser = await db
      .select()
      .from(users)
      .where(and(
        eq(users.id, userId),
        eq(users.role, "admin")
      ));

    if (!adminUser.length) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const [
      usersCount,
      investorsCount,
      tradersCount,
      transactions,
      investmentData,
      tradingData
    ] = await Promise.all([
      db.select({
        count: sql<number>`count(*)::int`
      })
      .from(users),
      
      db.select({
        count: sql<number>`count(distinct ${userInvestments.userId})::int`
      })
      .from(userInvestments),
      
      db.select({
        count: sql<number>`count(distinct ${trades.userId})::int`
      })
      .from(trades),
      
      db.select({
        deposits: sql<number>`COALESCE(SUM(CASE WHEN ${transactionHistory.type} = 'deposit' THEN ${transactionHistory.amount} ELSE 0 END), 0)::float`,
        withdrawals: sql<number>`COALESCE(SUM(CASE WHEN ${transactionHistory.type} = 'withdrawal' THEN ${transactionHistory.amount} ELSE 0 END), 0)::float`
      })
      .from(transactionHistory),

      db.select({
        total: sql<number>`COALESCE(SUM(${userInvestments.amount}), 0)::float`,
        date: sql<string>`DATE_TRUNC('day', ${userInvestments.createdAt})::date`
      })
      .from(userInvestments)
      .where(sql`${userInvestments.createdAt} >= NOW() - INTERVAL '30 days'`)
      .groupBy(sql`DATE_TRUNC('day', ${userInvestments.createdAt})`)
      .orderBy(sql`DATE_TRUNC('day', ${userInvestments.createdAt})`),

      db.select({
        total: sql<number>`COALESCE(SUM(${trades.amount}), 0)::float`,
        date: sql<string>`DATE_TRUNC('day', ${trades.createdAt})::date`
      })
      .from(trades)
      .where(sql`${trades.createdAt} >= NOW() - INTERVAL '30 days'`)
      .groupBy(sql`DATE_TRUNC('day', ${trades.createdAt})`)
      .orderBy(sql`DATE_TRUNC('day', ${trades.createdAt})`)
    ]);

    const netProfit = Number(transactions[0]?.deposits || 0) - 
                     Number(transactions[0]?.withdrawals || 0);

    const chartData: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const investmentEntry = investmentData.find(d => 
        new Date(d.date).toISOString().split('T')[0] === dateStr
      );
      const tradingEntry = tradingData.find(d => 
        new Date(d.date).toISOString().split('T')[0] === dateStr
      );

      return {
        name: new Date(dateStr).toLocaleDateString(),
        investments: Number(investmentEntry?.total || 0),
        trades: Number(tradingEntry?.total || 0),
        sales: Number(investmentEntry?.total || 0) + Number(tradingEntry?.total || 0)
      };
    }).reverse();

    const response: DashboardResponse = {
      statistics: {
        totalUsers: Number(usersCount[0]?.count || 0),
        totalInvestors: Number(investorsCount[0]?.count || 0),
        totalTraders: Number(tradersCount[0]?.count || 0),
        netProfit
      },
      chartData
    };

    return NextResponse.json(response);

  } catch (error: unknown) {
    console.error("Dashboard error:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
  
    return NextResponse.json(
      { 
        error: "Failed to fetch dashboard data",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }, 
      { status: 500 }
    );
  }
}
