import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { investments } from "@/lib/db/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";

enum SortOption {
  CreatedAtAsc = "createdAtAsc",
  CreatedAtDesc = "createdAtDesc",
}

export async function GET(req: NextRequest) {
  console.log("Received GET request for investments API");
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const sort = (searchParams.get("sort") as SortOption) || SortOption.CreatedAtDesc;
  const search = searchParams.get("search") || "";

  console.log("Query parameters:", { page, limit, sort, search });

  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    let whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(investments.name, `%${search}%`)
        )
      );
    }

    let orderByClause;
    switch (sort) {
      case SortOption.CreatedAtAsc:
        orderByClause = asc(investments.createdAt);
        break;
      case SortOption.CreatedAtDesc:
        orderByClause = desc(investments.createdAt);
        break;
      default:
        orderByClause = desc(investments.updatedAt);
    }

    const fetchedInvestments = await db
      .select()
      .from(investments)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(skip);

    const totalInvestmentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(investments)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalInvestments = totalInvestmentsResult[0].count;
    const totalPages = Math.ceil(totalInvestments / pageSize);

    return NextResponse.json({ 
      investments: fetchedInvestments, 
      totalPages,
      currentPage: pageNumber,
      totalItems: totalInvestments
    });
  } catch (error) {
    console.error("Error occurred while fetching investments:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const revalidate = 0;
