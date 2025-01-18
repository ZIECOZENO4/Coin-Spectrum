// app/api/admin/signal-purchases/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signalPurchases, users, tradingSignals } from "@/lib/db/schema";
import { eq, like, or, and, sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const limit = 10;
    const offset = (page - 1) * limit;

    const baseQuery = db
      .select({
        purchase: signalPurchases,
        user: {
          id: users.id,
          email: users.email,
          fullName: users.fullName,
        },
        signal: {
          name: tradingSignals.name,
          price: tradingSignals.price,
        }
      })
      .from(signalPurchases)
      .leftJoin(users, eq(signalPurchases.userId, users.id))
      .leftJoin(tradingSignals, eq(signalPurchases.signalId, tradingSignals.id));

    const purchases = await (search 
      ? baseQuery
          .where(
            or(
              like(users.email, `%${search}%`),
              like(users.fullName, `%${search}%`),
              like(tradingSignals.name, `%${search}%`)
            )
          )
      : baseQuery)
      .limit(limit)
      .offset(offset)
      .orderBy(signalPurchases.purchasedAt);

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(signalPurchases)
      .leftJoin(users, eq(signalPurchases.userId, users.id))
      .leftJoin(tradingSignals, eq(signalPurchases.signalId, tradingSignals.id));

    const totalCount = await (search
      ? countQuery.where(
          or(
            like(users.email, `%${search}%`),
            like(users.fullName, `%${search}%`),
            like(tradingSignals.name, `%${search}%`)
          )
        )
      : countQuery);

    return NextResponse.json({
      purchases,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching signal purchases:", error);
    return NextResponse.json({ error: "Failed to fetch signal purchases" }, { status: 500 });
  }
}
