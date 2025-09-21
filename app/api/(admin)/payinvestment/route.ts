import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, userInvestments, investments } from "@/lib/db/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";

enum SortOption {
  CreatedAtAsc = "createdAtAsc",
  CreatedAtDesc = "createdAtDesc",
  NameAsc = "nameAsc",
  NameDesc = "nameDesc",
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const sort = (searchParams.get("sort") as SortOption) || SortOption.CreatedAtDesc;
  const search = searchParams.get("search") || "";

  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    let whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(users.fullName, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.username, `%${search}%`)
        )
      );
    }

    let orderByClause;
    switch (sort) {
      case SortOption.CreatedAtAsc:
        orderByClause = asc(users.createdAt);
        break;
      case SortOption.CreatedAtDesc:
        orderByClause = desc(users.createdAt);
        break;
      case SortOption.NameAsc:
        orderByClause = asc(users.fullName);
        break;
      case SortOption.NameDesc:
        orderByClause = desc(users.fullName);
        break;
      default:
        orderByClause = desc(users.createdAt);
    }

    // Get all users with their investment information
    const fetchedUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        username: users.username,
        imageUrl: users.imageUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        // Get user's total investment amount
        totalInvestmentAmount: sql<number>`COALESCE(SUM(${userInvestments.amount}), 0)`,
        // Get user's investment count
        investmentCount: sql<number>`COUNT(${userInvestments.id})`,
        // Get latest investment info
        latestInvestment: {
          id: investments.id,
          name: investments.name,
          amount: userInvestments.amount,
          createdAt: userInvestments.createdAt,
        }
      })
      .from(users)
      .leftJoin(userInvestments, eq(users.id, userInvestments.userId))
      .leftJoin(investments, eq(userInvestments.investmentId, investments.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .groupBy(users.id, investments.id, userInvestments.id, userInvestments.amount, userInvestments.createdAt)
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(skip);

    // Get total count of users
    const totalUsersResult = await db
      .select({ count: sql<number>`count(DISTINCT ${users.id})` })
      .from(users)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalUsers = totalUsersResult[0].count;
    const totalPages = Math.ceil(totalUsers / pageSize);

    return NextResponse.json({ 
      users: fetchedUsers, 
      totalPages,
      currentPage: pageNumber,
      totalItems: totalUsers
    });
  } catch (error) {
    console.error("Error occurred while fetching users for payment:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const revalidate = 0;
