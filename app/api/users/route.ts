// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc, eq, ilike, or, sql, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const limit = 10;

  try {
    const skip = (page - 1) * limit;

    const baseCondition = search ? 
      or(
        ilike(users.fullName, `%${search}%`),
        ilike(users.email, `%${search}%`),
        ilike(users.username, `%${search}%`)
      ) : undefined;

    const usersList = await db
      .select()
      .from(users)
      .where(baseCondition)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(skip);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(baseCondition);

    return NextResponse.json({
      users: usersList,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
