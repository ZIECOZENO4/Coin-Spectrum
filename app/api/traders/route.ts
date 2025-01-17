// app/api/admin/traders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { traders, users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    console.log("Starting trader creation process...");
    
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      console.error("User not authenticated");
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
      console.error("Non-admin user attempted to create trader:", session.user.id);
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log("Request body:", body);

    // Validate required fields
    const {
      name,
      imageUrl,
      followers,
      minCapital,
      percentageProfit,
      totalProfit,
      rating,
      isPro = false
    } = body;

    if (!name || !imageUrl || !minCapital || !percentageProfit) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating trader record...");
    const trader = await db.transaction(async (tx) => {
      const [newTrader] = await tx.insert(traders).values({
        id: `trader_${Date.now()}`,
        name,
        imageUrl,
        followers: followers || 0,
        minCapital,
        percentageProfit,
        totalProfit: totalProfit || 0,
        rating: rating || 5,
        isPro,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      return newTrader;
    });

    console.log("Trader created successfully:", trader);

    return NextResponse.json({
      success: true,
      message: "Trader created successfully",
      trader
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
    console.log("Fetching traders...");
    
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

    console.log("Traders fetched successfully");

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
