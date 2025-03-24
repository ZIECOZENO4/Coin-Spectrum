
import { db } from "@/lib/db";
import { 
  users, 
  transactionHistory,
  trades,
  pendingDeposits,
  pendingWithdrawals,
  investments,
  TransactionTypeEnum, 
  userInvestments
} from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, sum, count, sql } from "drizzle-orm";

interface StatsResponse {
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
  totalTrades: number;
  netProfit: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
}

const toNumber = (value: unknown): number => {
  if (typeof value === 'string') {
    return parseFloat(value) || 0;
  }
  return Number(value) || 0;
};

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const [
      deposits,
      withdrawals,
      tradesData,
      investmentProfits,
      pendingDepositsData,
      pendingWithdrawalsData
    ] = await Promise.all([
      // Get deposits
      db
        .select({ total: sum(transactionHistory.amount) })
        .from(transactionHistory)
        .where(
          and(
            eq(transactionHistory.userId, userId),
            eq(transactionHistory.type, TransactionTypeEnum.Deposit)
          )
        )
        .execute(),

      // Get withdrawals
      db
        .select({ total: sum(transactionHistory.amount) })
        .from(transactionHistory)
        .where(
          and(
            eq(transactionHistory.userId, userId),
            eq(transactionHistory.type, TransactionTypeEnum.Withdrawal)
          )
        )
        .execute(),

      // Get trades count
      db
      .select({ 
        total: sum(trades.profit) 
      })
      .from(trades)
      .where(
        and(
          eq(trades.userId, userId),
          eq(trades.status, 'completed') // Only count settled trades
        )
      )
      .execute(),




// Calculate profits from user investments
db
.select({
total: sql`SUM((${userInvestments.amount} * ${investments.profitPercent}) / 100)`
})
.from(userInvestments)
.innerJoin(
investments,
eq(userInvestments.investmentId, investments.id)
)
.where(eq(userInvestments.userId, userId))
.execute(),




      // Get pending deposits
      db
        .select({ total: sum(pendingDeposits.amount) })
        .from(pendingDeposits)
        .where(
          and(
            eq(pendingDeposits.userId, userId),
            eq(pendingDeposits.status, "pending")
          )
        )
        .execute(),

      // Get pending withdrawals
      db
        .select({ total: sum(pendingWithdrawals.amount) })
        .from(pendingWithdrawals)
        .where(
          and(
            eq(pendingWithdrawals.userId, userId),
            eq(pendingWithdrawals.status, "pending")
          )
        )
        .execute()
    ]);

    const totalDeposits = toNumber(deposits[0]?.total);
    const totalWithdrawals = toNumber(withdrawals[0]?.total);
    const totalProfits = toNumber(investmentProfits[0]?.total);
    const totalTrades = toNumber(tradesData[0]?.total);
    const pendingDepositsTotal = toNumber(pendingDepositsData[0]?.total);
    const pendingWithdrawalsTotal = toNumber(pendingWithdrawalsData[0]?.total);
    
    // Calculate net profit (deposits - withdrawals)
    const netProfit = totalDeposits - totalWithdrawals;

    // Log all the data for debugging
    console.log('User Stats Data:', {
      raw: {
        deposits: deposits[0],
        withdrawals: withdrawals[0],
        trades: tradesData[0],
        investmentProfits: investmentProfits[0],
        pendingDeposits: pendingDepositsData[0],
        pendingWithdrawals: pendingWithdrawalsData[0]
      },
      calculated: {
        totalDeposits,
        totalWithdrawals,
        totalProfits,
        totalTrades,
        netProfit,
        pendingDepositsTotal,
        pendingWithdrawalsTotal
      }
    });

    const response: StatsResponse = {
      totalDeposits,
      totalWithdrawals,
      totalProfits,
      totalTrades,
      netProfit,
      pendingDeposits: pendingDepositsTotal,
      pendingWithdrawals: pendingWithdrawalsTotal
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return new Response("Internal Server Error", { 
      status: 500,
      statusText: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
