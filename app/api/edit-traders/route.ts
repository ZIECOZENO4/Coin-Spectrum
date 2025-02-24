// app/api/traders/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { traders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const allTraders = await db
      .select()
      .from(traders)
      .orderBy(traders.createdAt);

    return NextResponse.json(allTraders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch traders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    const newTrader = await db.insert(traders).values({
      id: `trader_${Date.now()}`,
      name: body.name,
      imageUrl: body.imageUrl,
      followers: body.followers || 0,
      minCapital: body.minCapital,
      percentageProfit: body.percentageProfit,
      totalProfit: body.totalProfit || 0,
      rating: body.rating,
      isPro: body.isPro || false,
    }).returning();

    return NextResponse.json(newTrader[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create trader" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    const updatedTrader = await db
      .update(traders)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(traders.id, body.id))
      .returning();

    return NextResponse.json(updatedTrader[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update trader" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = getAuth(req as any);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!userId || !id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await db.delete(traders).where(eq(traders.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete trader" },
      { status: 500 }
    );
  }
}
