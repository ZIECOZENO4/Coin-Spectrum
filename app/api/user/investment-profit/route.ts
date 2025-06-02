import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming your Prisma client is here
import { getUserAuth } from '@/lib/auth/utils'  // Adjust path to your auth utility

export async function GET(request: Request) {
    try {
        const { session } = await getUserAuth()
        if (!session?.user?.id) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

    // Replace this with your actual Prisma query
    // This example assumes you have an 'investmentProfitPayouts' table
    // and want to sum the 'amount' for the current user.
    const payouts = await db.investmentProfitPayouts.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: session.user.id,
      },
    });

    const totalProfit = payouts._sum.amount || 0;

    return NextResponse.json({ totalProfit });

  } catch (error) {
    console.error('[API_USER_INVESTMENT_PROFIT_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}