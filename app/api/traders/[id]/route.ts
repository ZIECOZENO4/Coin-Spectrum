// app/api/traders/[traderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { traders, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { traderId: string } }
) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trader = await db.query.traders.findFirst({
      where: eq(traders.id, params.traderId)
    });

    if (!trader) {
      return NextResponse.json({ error: "Trader not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      trader: {
        ...trader,
        followers: Number(trader.followers),
        minCapital: Number(trader.minCapital),
        percentageProfit: Number(trader.percentageProfit),
        totalProfit: Number(trader.totalProfit),
        rating: Number(trader.rating)
      }
    });
  } catch (error) {
    console.error("Error fetching trader:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { traderId: string } }
) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedTrader = {
      name: body.name,
      imageUrl: body.imageUrl,
      followers: Number(body.followers) || 0,
      minCapital: Number(body.minCapital),
      percentageProfit: Number(body.percentageProfit),
      totalProfit: Number(body.totalProfit) || 0,
      rating: Math.min(Math.max(Number(body.rating), 1), 5),
      isPro: Boolean(body.isPro),
      updatedAt: new Date()
    };

    const [updatedTrader] = await db
      .update(traders)
      .set(validatedTrader)
      .where(eq(traders.id, params.traderId))
      .returning();

    return NextResponse.json({
      success: true,
      trader: {
        ...updatedTrader,
        followers: Number(updatedTrader.followers),
        minCapital: Number(updatedTrader.minCapital),
        percentageProfit: Number(updatedTrader.percentageProfit),
        totalProfit: Number(updatedTrader.totalProfit),
        rating: Number(updatedTrader.rating)
      }
    });
  } catch (error) {
    console.error("Error updating trader:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
