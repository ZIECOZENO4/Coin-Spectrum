// app/api/trades/route.ts
import { db } from "@/lib/db";
import { trades } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userTrades = await db
      .select()
      .from(trades)
      .where(eq(trades.userId, userId))
      .orderBy(trades.createdAt);

    return NextResponse.json(userTrades);
  } catch (error) {
    console.error("Error fetching trades:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
