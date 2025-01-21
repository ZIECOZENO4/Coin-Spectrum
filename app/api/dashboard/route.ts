// app/api/admin/dashboard/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { sql, eq, and } from "drizzle-orm";
import { 
  users as usersTable, 
  userInvestments, 
  trades as tradesTable,
  transactionHistory
} from "@/lib/db/schema";

export interface DashboardData {
  users: { count: number }[];
  investors: { count: number }[];
  traders: { count: number }[];
  transactions: {
    deposits: number;
    withdrawals: number;
  }[];
  investments: {
    total: number;
    date: string;
  }[];
  trades: {
    total: number;
    date: string;
  }[];
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await db
      .select()
      .from(usersTable)
      .where(and(
        eq(usersTable.id, userId),
        eq(usersTable.role, "admin")
      ));

    if (!adminUser.length) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const [userCount, investorCount, traderCount, transactionData, investmentData, tradeData] = 
    await Promise.all([
      db.select({
        count: sql<number>`count(*)::int`
      }).from(usersTable),
      
      db.select({
        count: sql<number>`count(distinct ${userInvestments.userId})::int`
      }).from(userInvestments),
      
      db.select({
        count: sql<number>`count(distinct ${tradesTable.userId})::int`
      }).from(tradesTable),
      
      db.select({
        deposits: sql<number>`COALESCE(SUM(CASE WHEN ${transactionHistory.type} = 'deposit' THEN ${transactionHistory.amount} ELSE 0 END), 0)::float`,
        withdrawals: sql<number>`COALESCE(SUM(CASE WHEN ${transactionHistory.type} = 'withdrawal' THEN ${transactionHistory.amount} ELSE 0 END), 0)::float`
      }).from(transactionHistory),

      db.select({
        total: sql<number>`COALESCE(SUM(${userInvestments.amount}), 0)::float`,
        date: sql<string>`DATE_TRUNC('day', ${userInvestments.createdAt})::date`
      })
      .from(userInvestments)
      .where(sql`${userInvestments.createdAt} >= NOW() - INTERVAL '30 days'`)
      .groupBy(sql`DATE_TRUNC('day', ${userInvestments.createdAt})`)
      .orderBy(sql`DATE_TRUNC('day', ${userInvestments.createdAt})`),

      db.select({
        total: sql<number>`COALESCE(SUM(${tradesTable.amount}), 0)::float`,
        date: sql<string>`DATE_TRUNC('day', ${tradesTable.createdAt})::date`
      })
      .from(tradesTable)
      .where(sql`${tradesTable.createdAt} >= NOW() - INTERVAL '30 days'`)
      .groupBy(sql`DATE_TRUNC('day', ${tradesTable.createdAt})`)
      .orderBy(sql`DATE_TRUNC('day', ${tradesTable.createdAt})`)
    ]);

    return NextResponse.json({ 
      users: userCount, 
      investors: investorCount, 
      traders: traderCount, 
      transactions: transactionData, 
      investments: investmentData, 
      trades: tradeData 
    });

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
