import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, transactionHistory } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, paymentType, description } = body;

    // Validate input
    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid userId or amount" },
        { status: 400 }
      );
    }

    // Get the user details
    const user = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userData = user[0];

    // Add transaction history record
    await db.insert(transactionHistory).values({
      id: crypto.randomUUID(),
      userId: userId,
      type: "investment", // or could be "bonus" based on paymentType
      amount: amount,
      description: description || `${paymentType === "profit" ? "Profit" : "Bonus"} payment of $${amount}`,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully processed $${amount} ${paymentType === "profit" ? "profit" : "bonus"} payment for ${userData.fullName || userData.email}`,
      data: {
        userId,
        amount,
        paymentType,
        userName: userData.fullName || userData.email,
        userEmail: userData.email,
      }
    });

  } catch (error) {
    console.error("Error processing payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const revalidate = 0;
