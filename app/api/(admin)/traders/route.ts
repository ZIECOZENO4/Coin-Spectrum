// app/api/admin/traders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { traders, users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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

    const {
      name,
      imageUrl,
      followers,
      minCapital,
      percentageProfit,
      totalProfit,
      rating,
      isPro
    } = await req.json();

    const trader = await db.insert(traders).values({
      id: `trader_${Date.now()}`,
      name,
      imageUrl,
      followers,
      minCapital,
      percentageProfit,
      totalProfit,
      rating,
      isPro,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    return NextResponse.json({
      success: true,
      trader: trader[0]
    });

  } catch (error) {
    console.error("Failed to create trader:", error);
    return NextResponse.json(
      { error: "Failed to create trader" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const allTraders = await db
      .select()
      .from(traders)
      .orderBy(traders.createdAt);

    return NextResponse.json({
      success: true,
      traders: allTraders
    });

  } catch (error) {
    console.error("Failed to fetch traders:", error);
    return NextResponse.json(
      { error: "Failed to fetch traders" },
      { status: 500 }
    );
  }
}
