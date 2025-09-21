

import { getUserId } from "./../../../../lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userInvestments, investments, investmentStatuses } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = getUserId();
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "10";

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" }, 
      { status: 400 }
    );
  }

  try {
    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * pageSize;

    // Get user investments with related data
    const [fetchedInvestments, totalInvestmentsResult] = await Promise.all([
      db.select({
        id: userInvestments.id,
        userId: userInvestments.userId,
        amount: userInvestments.amount,
        createdAt: userInvestments.createdAt,
        updatedAt: userInvestments.updatedAt,
        investment: {
          id: investments.id,
          name: investments.name,
          price: investments.price,
          profitPercent: investments.profitPercent,
          rating: investments.rating,
          principalReturn: investments.principalReturn,
          principalWithdraw: investments.principalWithdraw,
          creditAmount: investments.creditAmount,
          depositFee: investments.depositFee,
          debitAmount: investments.debitAmount,
          durationDays: investments.durationDays,
        },
        status: {
          id: investmentStatuses.id,
          status: investmentStatuses.status
        }
      })
      .from(userInvestments)
      .leftJoin(investments, eq(userInvestments.investmentId, investments.id))
      .leftJoin(investmentStatuses, eq(userInvestments.id, investmentStatuses.id))
      .where(eq(userInvestments.userId, userId))
      .limit(pageSize)
      .offset(skip)
      .orderBy(desc(userInvestments.createdAt)),

      // Count total user investments
      db.select({ 
        count: sql<number>`cast(count(*) as integer)` 
      })
      .from(userInvestments)
      .where(eq(userInvestments.userId, userId))
    ]);

    const totalInvestments = totalInvestmentsResult[0]?.count ?? 0;
    const totalPages = Math.ceil(totalInvestments / pageSize);

    return NextResponse.json({
      investments: fetchedInvestments,
      totalPages,
      currentPage: pageNumber,
      totalItems: totalInvestments
    });
  } catch (error) {
    console.error("Error fetching investments:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}

export const revalidate = 0;
