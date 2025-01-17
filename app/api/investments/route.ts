// app/api/admin/investments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  userInvestments,
  users,
  investments,
} from "@/lib/db/schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  try {
    const skip = (page - 1) * limit;

    const fetchedInvestments = await db
      .select({
        id: userInvestments.id,
        userId: userInvestments.userId,
        amount: userInvestments.amount,
        createdAt: userInvestments.createdAt,
        updatedAt: userInvestments.updatedAt,
        user: users,
        investment: investments,
      })
      .from(userInvestments)
      .leftJoin(users, eq(userInvestments.userId, users.id))
      .leftJoin(investments, eq(userInvestments.investmentId, investments.id))
      .orderBy(order === "desc" ? desc(userInvestments.createdAt) : asc(userInvestments.createdAt))
      .limit(limit)
      .offset(skip);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(userInvestments)
      .then(res => res[0].count);

    return NextResponse.json({
      investments: fetchedInvestments,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Investment ID is required" },
      { status: 400 }
    );
  }

  try {
    await db.delete(userInvestments).where(eq(userInvestments.id, id));
    return NextResponse.json({ message: "Investment deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete investment" },
      { status: 500 }
    );
  }
}
