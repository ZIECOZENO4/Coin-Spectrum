// app/api/trades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trades, users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { TradeEmail } from "@/emails/TradeEmail";

// Input validation interface
interface TradeRequest {
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  leverage: number;
  expiry: string;
}

const MINIMUM_BALANCE = 50;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    console.log("Processing trade request...");
    
    // Validate request body
    const body = await req.json();
    const { symbol, type, amount, leverage, expiry } = body as TradeRequest;

    if (!symbol || !type || !amount || !leverage || !expiry) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0 || leverage <= 0) {
      return NextResponse.json(
        { error: "Invalid amount or leverage values" },
        { status: 400 }
      );
    }

    // Authenticate user
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user and validate balance
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    }).catch(error => {
      console.error("Database query error:", error);
      throw new Error("Failed to fetch user data");
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
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
      try {
        const [newTrade] = await tx.insert(trades).values({
          id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: session.user.id,
          symbol,
          type,
          amount,
          leverage,
          expiry,
          status: "active",
          openPrice: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }).returning();

        await tx.update(users)
          .set({ 
            balance: user.balance - amount,
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id));

        return newTrade;
      } catch (txError) {
        console.error("Transaction error:", txError);
        throw new Error("Failed to process trade transaction");
      }
    });

    // Send email notification
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
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
        // Continue execution even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Trade placed successfully",
      trade
    });

  } catch (error) {
    console.error("Failed to place trade:", error);
    const errorMessage = error instanceof Error ? 
      error.message : "An unexpected error occurred";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
