import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { 
  investments, 
  investmentPlans, 
  userInvestments,
  users,
  transactionHistory,
  TransactionTypeEnum
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { InvestmentEmail } from "@/emails/InvestmentEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface InvestmentRequest {
  id: string;
  amount: number;
}

export async function POST(req: NextRequest) {
  try {
    
    const body = await req.json() as InvestmentRequest;
    // Validate input
    if (!body.id || typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid investment parameters" },
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

    // Fetch user and investment plan
    const [user, investmentPlan] = await Promise.all([
      db.select().from(users).where(eq(users.id, session.user.id)).limit(1),
      db.select().from(investmentPlans).where(eq(investmentPlans.id, body.id)).limit(1)
    ]);

    const foundUser = user[0];
    const foundPlan = investmentPlan[0];

    if (!foundUser || !foundPlan) {
      return NextResponse.json(
        { error: !foundUser ? "User not found" : "Investment plan not found" },
        { status: 404 }
      );
    }

    // Validate investment amount against plan limits
    if (body.amount < foundPlan.minAmount || (foundPlan.maxAmount && body.amount > foundPlan.maxAmount)) {
      return NextResponse.json(
        { error: `Investment amount must be between ${foundPlan.minAmount} and ${foundPlan.maxAmount || 'unlimited'}` },
        { status: 400 }
      );
    }

    if (foundUser.balance < body.amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    return await db.transaction(async (tx) => {
      // Create investment record
      const [newInvestment] = await tx.insert(investments).values({
        id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        name: foundPlan.name,
        price: body.amount,
        profitPercent: foundPlan.roi,
        rating: 0,
        principalReturn: true,
        principalWithdraw: foundPlan.instantWithdrawal,
        creditAmount: body.amount,
        depositFee: "0",
        debitAmount: 0,
        durationDays: Math.floor(foundPlan.durationHours / 24),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Create user investment record
      const [userInvestment] = await tx.insert(userInvestments).values({
        id: `ui_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        userId: session.user.id,
        investmentId: newInvestment.id,
        amount: body.amount,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Update user balance
      await tx.update(users)
        .set({
          balance: foundUser.balance - body.amount,
          updatedAt: new Date()
        })
        .where(eq(users.id, session.user.id));

      // Record transaction
      await tx.insert(transactionHistory).values({
        id: `th_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        userId: session.user.id,
        type: TransactionTypeEnum.Investment,
        amount: body.amount,
        description: `Investment in ${foundPlan.name}`,
        investmentId: newInvestment.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Send email notification
      if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && foundUser.email) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: foundUser.email,
            subject: "Investment Created Successfully",
            react: InvestmentEmail({
              userFirstName: foundUser.firstName || foundUser.email,
              amount: body.amount.toString(),
              planName: foundPlan.name,
              transactionId: newInvestment.id,
              isAdminCopy: false
            })
          });
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Investment created successfully",
        data: {
          investment: newInvestment,
          userInvestment: userInvestment
        }
      });
    });

  } catch (error) {
    console.error("Investment creation failed:", error);
    return NextResponse.json(
      { 
        error: "Failed to create investment",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
