// app/api/copy-trades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userCopyTrades, traders, users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { traderId, amount } = await req.json();
    
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get trader details
    const trader = await db.query.traders.findFirst({
      where: eq(traders.id, traderId)
    });

    if (!trader) {
      return NextResponse.json(
        { error: "Trader not found" },
        { status: 404 }
      );
    }

    // Validate minimum capital
    if (amount < trader.minCapital) {
      return NextResponse.json(
        { error: `Minimum capital required is $${trader.minCapital}` },
        { status: 400 }
      );
    }

    // Check user balance
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });

    if (!user || user.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create copy trade with transaction
    const copyTrade = await db.transaction(async (tx) => {
      // Create copy trade record
      const [newCopyTrade] = await tx.insert(userCopyTrades).values({
        id: `ct_${Date.now()}`,
        userId: session.user.id,
        traderId: trader.id,
        amount: amount,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Update user balance
      await tx.update(users)
        .set({ 
          balance: user.balance - amount,
          updatedAt: new Date()
        })
        .where(eq(users.id, session.user.id));

      return newCopyTrade;
    });

    return NextResponse.json({
      success: true,
      message: "Copy trade created successfully",
      copyTrade
    });

  } catch (error) {
    console.error("Failed to create copy trade:", error);
    return NextResponse.json(
      { error: "Failed to create copy trade" },
      { status: 500 }
    );
  }
}
