import { db } from "@/lib/db";
import { 
  investments, 
  pendingDeposits, 
  users, 
  withdrawals,
  userInvestments 
} from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { count, eq, sum } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalUsers,
      totalDeposits,
      totalWithdrawals,
      totalInvestments,
      totalInvestors
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ total: sum(pendingDeposits.amount) })
        .from(pendingDeposits)
        .where(eq(pendingDeposits.status, "approved")),
      db.select({ total: sum(withdrawals.amount) })
        .from(withdrawals)
        .where(eq(withdrawals.status, "CONFIRMED")),
      db.select({ total: sum(userInvestments.amount) })
        .from(userInvestments),
      db.select({ count: count() })
        .from(userInvestments)
        .groupBy(userInvestments.userId)
    ]);

    return NextResponse.json({
      totalUsers: totalUsers[0].count,
      totalDeposits: totalDeposits[0].total || 0,
      totalWithdrawals: totalWithdrawals[0].total || 0,
      totalInvestments: totalInvestments[0].total || 0,
      totalInvestors: totalInvestors.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
