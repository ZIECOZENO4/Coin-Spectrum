// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { trades, users } from "@/lib/db/schema";
// import { getUserAuth } from "@/lib/auth/utils";
// import { eq } from "drizzle-orm";
// import { Resend } from "resend";
// import { TradeEmail } from "@/emails/TradeEmail";

// interface TradeRequest {
//   symbol: string;
//   type: string;  // Changed from 'BUY' | 'SELL' to accept lowercase
//   amount: number;
//   leverage: string;
//   expiry: string;
// }

// const MINIMUM_BALANCE = 50;
// const VALID_EXPIRY_TIMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d']; 
// const resend = new Resend(process.env.RESEND_API_KEY);

// async function getMarketPrice(symbol: string): Promise<number> {
//   return 1.0000;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     console.log("Received request body:", body); // Debug log

//     const { symbol, type, amount, leverage, expiry } = body as TradeRequest;

//     // Basic validation
//     if (!symbol || !type || amount === undefined || !leverage || !expiry) {
//       return NextResponse.json(
//         { error: "Missing required fields", received: { symbol, type, amount, leverage, expiry } },
//         { status: 400 }
//       );
//     }

//     // Convert type to uppercase and validate
//     const normalizedType = type.toUpperCase();
//     if (!['BUY', 'SELL'].includes(normalizedType)) {
//       return NextResponse.json(
//         { error: "Invalid trade type. Must be buy or sell" },
//         { status: 400 }
//       );
//     }

//     // Parse amount as number if it's a string
//     const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(parsedAmount) || parsedAmount <= 0) {
//       return NextResponse.json(
//         { error: "Amount must be a positive number" },
//         { status: 400 }
//       );
//     }

//     // Parse leverage
//     const leverageNum = parseInt(leverage.replace(/[^0-9]/g, ''));
//     if (isNaN(leverageNum) || leverageNum <= 0) {
//       return NextResponse.json(
//         { error: "Invalid leverage value" },
//         { status: 400 }
//       );
//     }

//     if (!VALID_EXPIRY_TIMES.includes(expiry)) {
//       return NextResponse.json(
//         { error: "Invalid expiry time" },
//         { status: 400 }
//       );
//     }

//     const { session } = await getUserAuth();
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Get user without forUpdate
//     const user = await db.query.users.findFirst({
//       where: eq(users.id, session.user.id)
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     if (!user.email) {
//       return NextResponse.json(
//         { error: "User email not found" },
//         { status: 400 }
//       );
//     }

//     if (user.balance < MINIMUM_BALANCE) {
//       return NextResponse.json(
//         { error: `Minimum balance of $${MINIMUM_BALANCE} required` },
//         { status: 400 }
//       );
//     }

//     if (user.balance < parsedAmount) {
//       return NextResponse.json(
//         { error: "Insufficient balance" },
//         { status: 400 }
//       );
//     }

//     const marketPrice = await getMarketPrice(symbol);

//     const [newTrade] = await db.insert(trades).values({
//       id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       userId: session.user.id,
//       symbol,
//       type: normalizedType,
//       amount: parsedAmount,
//       leverage: leverageNum,
//       expiry,
//       status: "active",
//       openPrice: marketPrice,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }).returning();

//     await db.update(users)
//       .set({ 
//         balance: user.balance - parsedAmount,
//         updatedAt: new Date()
//       })
//       .where(eq(users.id, user.id));

//     // Email notification
//     if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
//       try {
//         await resend.emails.send({
//           from: process.env.RESEND_FROM_EMAIL,
//           to: user.email,
//           subject: "Trade Placed Successfully",
//           react: TradeEmail({
//             userName: user.firstName || user.email,
//             symbol,
//             type: normalizedType,
//             amount: parsedAmount.toString(),
//             leverage: leverageNum.toString(),
//             expiry,
//             tradeId: newTrade.id
//           })
//         });
//       } catch (emailError) {
//         console.error("Email sending failed:", emailError);
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Trade placed successfully",
//       trade: newTrade
//     });

//   } catch (error) {
//     console.error("Trade placement error:", error);
    
//     if (error instanceof Error) {
//       return NextResponse.json(
//         { error: error.message },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: "An unexpected error occurred" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trades, users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { TradeEmail } from "@/emails/TradeEmail";

interface TradeRequest {
  symbol: string;
  type: string;
  amount: number;
  leverage: string;
  expiry: string;
}

const MINIMUM_BALANCE = 50;
const VALID_EXPIRY_TIMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
const resend = new Resend(process.env.RESEND_API_KEY);

// New expiry conversion function
function convertExpiryToUTC(expiry: string): Date {
  const now = Date.now();
  const value = parseInt(expiry.slice(0, -1));
  const unit = expiry.slice(-1);

  switch(unit) {
    case 'm': return new Date(now + value * 60 * 1000);
    case 'h': return new Date(now + value * 60 * 60 * 1000);
    case 'd': return new Date(now + value * 24 * 60 * 60 * 1000);
    default: throw new Error('Invalid expiry unit');
  }
}

async function getMarketPrice(symbol: string): Promise<number> {
  return 1.0000;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { symbol, type, amount, leverage, expiry } = body as TradeRequest;

    if (!symbol || !type || amount === undefined || !leverage || !expiry) {
      return NextResponse.json(
        { error: "Missing required fields", received: { symbol, type, amount, leverage, expiry } },
        { status: 400 }
      );
    }

    const normalizedType = type.toUpperCase();
    if (!['BUY', 'SELL'].includes(normalizedType)) {
      return NextResponse.json(
        { error: "Invalid trade type. Must be buy or sell" },
        { status: 400 }
      );
    }

    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    const leverageNum = parseInt(leverage.replace(/[^0-9]/g, ''));
    if (isNaN(leverageNum) || leverageNum <= 0) {
      return NextResponse.json(
        { error: "Invalid leverage value" },
        { status: 400 }
      );
    }

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

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
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

    if (user.balance < parsedAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    const marketPrice = await getMarketPrice(symbol);
    const expiryDate = convertExpiryToUTC(expiry);

    const [newTrade] = await db.insert(trades).values({
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: session.user.id,
      symbol,
      type: normalizedType,
      amount: parsedAmount,
      leverage: leverageNum,
      expiry: expiryDate.toISOString(), // Store as ISO 8601 format
      status: "active",
      openPrice: marketPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    await db.update(users)
      .set({ 
        balance: user.balance - parsedAmount,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: user.email,
          subject: "Trade Placed Successfully",
          react: TradeEmail({
            userName: user.firstName || user.email,
            symbol,
            type: normalizedType,
            amount: parsedAmount.toString(),
            leverage: leverageNum.toString(),
            expiry: expiry, // Keep original format for user communication
            tradeId: newTrade.id
          })
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Trade placed successfully",
      trade: {
        ...newTrade,
        expiry: expiryDate.toISOString() // Return ISO format in response
      }
    });

  } catch (error) {
    console.error("Trade placement error:", error);
    
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
