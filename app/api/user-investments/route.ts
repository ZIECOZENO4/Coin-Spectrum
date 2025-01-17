// app/api/user-investments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userInvestments, users, investments } from "@/lib/db/schema";
import { eq, and, or, ilike, desc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  try {
    const skip = (page - 1) * limit;

    const whereConditions = search 
      ? [
          or(
            ilike(users.fullName, `%${search}%`),
            ilike(users.email, `%${search}%`),
            ilike(investments.name, `%${search}%`)
          )
        ]
      : [];

    const userInvestmentsList = await db
      .select({
        id: userInvestments.id,
        amount: userInvestments.amount,
        createdAt: userInvestments.createdAt,
        user: users,
        investment: investments,
      })
      .from(userInvestments)
      .leftJoin(users, eq(userInvestments.userId, users.id))
      .leftJoin(investments, eq(userInvestments.investmentId, investments.id))
      .where(and(...whereConditions))
      .orderBy(desc(userInvestments.createdAt))
      .limit(limit)
      .offset(skip);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(userInvestments)
      .where(and(...whereConditions));

    return NextResponse.json({
      investments: userInvestmentsList,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}
