// app/api/trades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trades, users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { TradeEmail } from "@/emails/TradeEmail";


const resend = new Resend(process.env.RESEND_API_KEY);

const MINIMUM_BALANCE = 50; // Minimum USD balance required

export async function POST(req: NextRequest) {
  try {
    console.log("Processing trade request...");
    
    const { symbol, type, amount, leverage, expiry } = await req.json();
    
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user and check balance
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.balance < MINIMUM_BALANCE) {
      return NextResponse.json(
        { error: `Minimum balance of $${MINIMUM_BALANCE} required` },
        { status: 400 }
      );
    }

    if (user.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create trade with transaction
    const trade = await db.transaction(async (tx) => {
      const [newTrade] = await tx.insert(trades).values({
        id: `trade_${Date.now()}`,
        userId: session.user.id,
        symbol,
        type,
        amount,
        leverage,
        expiry,
        status: "active",
        openPrice: 0, // You would get this from your trading provider
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Update user balance
      await tx.update(users)
        .set({ 
          balance: user.balance - amount,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      return newTrade;
    });

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: user.email,
          subject: "Trade Placed Successfully",
          react: TradeEmail({
            userName: user.firstName || user.email,
            symbol,
            type,
            amount: amount.toString(),
            leverage: leverage.toString(),
            expiry,
            tradeId: trade.id
          })
        });
        console.log("Trade confirmation email sent");
      } catch (emailError) {
        console.error("Failed to send trade email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Trade placed successfully",
      trade
    });

  } catch (error) {
    console.error("Failed to place trade:", error);
    return NextResponse.json(
      { error: "Failed to place trade" },
      { status: 500 }
    );
  }
}
