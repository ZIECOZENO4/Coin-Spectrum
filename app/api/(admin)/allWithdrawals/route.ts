
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withdrawals, users } from "@/lib/db/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";

enum SortOption {
  CreatedAtAsc = "createdAtAsc",
  CreatedAtDesc = "createdAtDesc",
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const sort = (searchParams.get("sort") as SortOption) || SortOption.CreatedAtDesc;
  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("statusFilter") || "";


  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    let whereConditions = [];
    if (search) {
      whereConditions.push(ilike(users.fullName, `%${search}%`));
    }
    if (statusFilter) {
      whereConditions.push(eq(withdrawals.status, statusFilter));
    }

    let orderByClause;
    switch (sort) {
      case SortOption.CreatedAtAsc:
        orderByClause = asc(withdrawals.createdAt);
        break;
      case SortOption.CreatedAtDesc:
        orderByClause = desc(withdrawals.createdAt);
        break;
      default:
        orderByClause = desc(withdrawals.updatedAt);
    }

    const fetchedWithdrawals = await db
      .select({
        withdrawal: withdrawals,
        user: users,
      })
      .from(withdrawals)
      .leftJoin(users, eq(withdrawals.userId, users.id))
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(skip);

    const totalWithdrawalsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(withdrawals)
      .leftJoin(users, eq(withdrawals.userId, users.id))
      .where(and(...whereConditions));

    const totalWithdrawals = totalWithdrawalsResult[0].count;
    const totalPages = Math.ceil(totalWithdrawals / pageSize);

    return NextResponse.json({ withdrawals: fetchedWithdrawals, totalPages });
  } catch (error) {
    console.error("Error occurred while fetching withdrawals:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const revalidate = 0;
