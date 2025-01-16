import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { 
  investments, 
  investmentPlans, 
  investmentStatuses, 
  imageProofs, 
  users,
  transactionHistory,
  TransactionTypeEnum,
  Wallets
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { InvestmentEmail } from "@/emails/InvestmentEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    console.log("Starting investment creation process...");
    
    const body = await req.json();
    console.log("Request body:", body);
    
    const {
      userName,
      userEmail,
      transactionId,
      id,
      amount,
      imageUrl,
      imageId
    } = body;

    // Validate required fields
    if (!userName || !userEmail || !transactionId || !id || !amount || !imageUrl || !imageId) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      console.error("User not authenticated");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get user and investment plan
    const [user, investmentPlan] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, session.user.id)
      }),
      db.query.investmentPlans.findFirst({
        where: eq(investmentPlans.id, id)
      })
    ]);

    if (!user) {
      console.error("User not found:", session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!investmentPlan) {
      console.error("Investment plan not found:", id);
      return NextResponse.json({ error: "Investment plan not found" }, { status: 404 });
    }

    // Validate investment amount
    if (amount < investmentPlan.minAmount || (investmentPlan.maxAmount && amount > investmentPlan.maxAmount)) {
      return NextResponse.json(
        { error: `Amount must be between ${investmentPlan.minAmount} and ${investmentPlan.maxAmount || 'unlimited'}` },
        { status: 400 }
      );
    }

    // Create investment with transaction
    const investment = await db.transaction(async (tx) => {
      const [newInvestment] = await tx.insert(investments).values({
        id: `inv_${transactionId}`,
        name: investmentPlan.name,
        price: amount,
        profitPercent: investmentPlan.roi,
        rating: 5,
        principalReturn: true,
        principalWithdraw: true,
        creditAmount: amount,
        depositFee: "0",
        debitAmount: 0,
        durationDays: Math.floor(investmentPlan.durationHours / 24),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      await tx.insert(investmentStatuses).values({
        id: `is_${transactionId}`,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await tx.insert(transactionHistory).values({
        id: `th_${transactionId}`,
        userId: session.user.id,
        type: TransactionTypeEnum.Investment,
        amount: amount,
        description: `Investment in ${investmentPlan.name}`,
        investmentId: newInvestment.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await tx.insert(imageProofs).values({
        id: imageId,
        url: imageUrl,
        investmentId: newInvestment.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return newInvestment;
    });

    // Send email notifications
    if (process.env.RESEND_API_KEY) {
      try {
        await Promise.all([
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: userEmail,
            subject: "Investment Created Successfully",
            react: InvestmentEmail({
              userName,
              amount: amount.toString(),
              planName: investmentPlan.name,
              transactionId: investment.id,
              isAdminCopy: false
            })
          }),
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: process.env.ADMIN_EMAIL!,
            subject: "New Investment Created",
            react: InvestmentEmail({
              userName,
              amount: amount.toString(),
              planName: investmentPlan.name,
              transactionId: investment.id,
              isAdminCopy: true
            })
          })
        ]);
        console.log("Email notifications sent successfully");
      } catch (emailError) {
        console.error("Failed to send email notifications:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Investment created successfully",
      investment
    });

  } catch (error) {
    console.error("Investment creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
