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

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trades, users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { TradeEmail } from "@/emails/TradeEmail";

interface TradeRequest {
  symbol: string;
  type: 'BUY' | 'SELL';
  amount: number;
  leverage: string | number;
  expiry: string;
}

const MINIMUM_BALANCE = 50;
const VALID_EXPIRY_TIMES = ['5m', '15m', '30m', '1h', '4h', '1d'];
const resend = new Resend(process.env.RESEND_API_KEY);

// Mock function - Replace with actual market price fetching logic
async function getMarketPrice(symbol: string): Promise<number> {
  // Implement real market price fetching here
  return 1.0000;
}

const logError = (error: unknown, context: string) => {
  console.error({
    message: `Error in ${context}`,
    error: error instanceof Error ? error.message : String(error),
    timestamp: new Date().toISOString()
  });
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    const body = await req.json();
    const { symbol, type, amount, leverage, expiry } = body as TradeRequest;

    // Enhanced input validation
    if (!symbol || !type || !amount || !leverage || !expiry) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate trade type
    const normalizedType = type.toUpperCase();
    if (!['BUY', 'SELL'].includes(normalizedType)) {
      return NextResponse.json(
        { error: "Invalid trade type. Must be BUY or SELL" },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Validate leverage
    const leverageNum = Number(leverage);
    if (isNaN(leverageNum) || leverageNum <= 0) {
      return NextResponse.json(
        { error: "Invalid leverage value" },
        { status: 400 }
      );
    }

    // Validate expiry
    if (!VALID_EXPIRY_TIMES.includes(expiry)) {
      return NextResponse.json(
        { error: "Invalid expiry time" },
        { status: 400 }
      );
    }

    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const trade = await db.transaction(async (tx) => {
      // Lock the user row for update
      const user = await tx.query.users.findFirst({
        where: eq(users.id, session.user.id),
        forUpdate: true
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.email) {
        throw new Error("User email not found");
      }

      if (user.balance < MINIMUM_BALANCE) {
        throw new Error(`Minimum balance of $${MINIMUM_BALANCE} required`);
      }

      if (user.balance < amount) {
        throw new Error("Insufficient balance");
      }

      const marketPrice = await getMarketPrice(symbol);
      
      const [newTrade] = await tx.insert(trades).values({
        id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        symbol,
        type: normalizedType,
        amount,
        leverage: leverageNum,
        expiry,
        status: "active",
        openPrice: marketPrice,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      await tx.update(users)
        .set({ 
          balance: user.balance - amount,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      return { newTrade, userEmail: user.email, userName: user.firstName };
    });

    // Send email notification
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: trade.userEmail,
          subject: "Trade Placed Successfully",
          react: TradeEmail({
            userName: trade.userName || trade.userEmail,
            symbol,
            type: normalizedType,
            amount: amount.toString(),
            leverage: leverageNum.toString(),
            expiry,
            tradeId: trade.newTrade.id
          })
        });
      } catch (emailError) {
        logError(emailError, "Email sending");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Trade placed successfully",
      trade: trade.newTrade
    });

  } catch (error) {
    logError(error, "Trade placement");
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
