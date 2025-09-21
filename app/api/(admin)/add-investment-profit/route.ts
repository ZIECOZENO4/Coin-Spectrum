import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userInvestments, users, transactionHistory } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userInvestmentId, amount } = body;

    // Validate input
    if (!userInvestmentId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid userInvestmentId or amount" },
        { status: 400 }
      );
    }

    // Get the user investment details
    const userInvestment = await db
      .select({
        id: userInvestments.id,
        userId: userInvestments.userId,
        amount: userInvestments.amount,
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
        }
      })
      .from(userInvestments)
      .leftJoin(users, eq(userInvestments.userId, users.id))
      .where(eq(userInvestments.id, userInvestmentId))
      .limit(1);

    if (!userInvestment.length) {
      return NextResponse.json(
        { error: "User investment not found" },
        { status: 404 }
      );
    }

    const investment = userInvestment[0];

    // Add transaction history record
    await db.insert(transactionHistory).values({
      id: crypto.randomUUID(),
      userId: investment.userId,
      investmentId: userInvestmentId,
      type: "investment",
      amount: amount,
      description: `Profit payment of $${amount} for investment`,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully processed $${amount} profit payment for ${investment.user?.fullName || investment.user?.email}`,
      data: {
        userInvestmentId,
        amount,
        userId: investment.userId,
        userName: investment.user?.fullName || investment.user?.email,
      }
    });

  } catch (error) {
    console.error("Error processing investment profit:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const revalidate = 0;
