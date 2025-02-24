// app/api/traders/[traderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { traders, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { handleError } from "@/middleware/errorHandler";
import { getUserAuth } from "@/lib/auth/utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: { traderId: string } }
) {
  try {
    // Authentication
    const { session } = await getUserAuth();
    if (!session?.user?.id) return NextResponse.json(
      { success: false, error: "Unauthorized" }, 
      { status: 401 }
    );

    // Authorization
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });
    if (user?.role !== "admin") return NextResponse.json(
      { success: false, error: "Admin access required" },
      { status: 403 }
    );

    // Request Validation
    if (!params.traderId) return NextResponse.json(
      { success: false, error: "Missing trader ID" },
      { status: 400 }
    );

    const body = await req.json();
    
    // Data Validation
    const requiredFields = ['name', 'imageUrl', 'minCapital', 'percentageProfit'];
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) return NextResponse.json(
      { 
        success: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      },
      { status: 400 }
    );

    // Data Transformation
    const validatedData = {
      name: String(body.name),
      imageUrl: String(body.imageUrl),
      followers: Number(body.followers) || 0,
      minCapital: Number(body.minCapital),
      percentageProfit: Number(body.percentageProfit),
      totalProfit: Number(body.totalProfit) || 0,
      rating: Math.min(Math.max(Number(body.rating), 1), 5), // Clamp rating 1-5
      isPro: Boolean(body.isPro),
      updatedAt: new Date()
    };

    // Database Operation
    const [updatedTrader] = await db.update(traders)
      .set(validatedData)
      .where(eq(traders.id, params.traderId))
      .returning();

    if (!updatedTrader) return NextResponse.json(
      { success: false, error: "Trader not found" },
      { status: 404 }
    );

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
    return handleError(error);
  }
}
