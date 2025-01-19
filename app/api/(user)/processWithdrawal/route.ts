import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { WithdrawalEmail } from "@/emails/withdrawal-email";
import { getUserAuth } from "@/lib/auth/utils";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import { 
  users, 
  pendingWithdrawals,
  transactionHistory,
  TransactionTypeEnum
} from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const withdrawalSchema = z.object({
  withdrawalAmount: z.number().positive(),
  cryptoType: z.string(),
  walletAddress: z.string()
});

export async function POST(request: NextRequest) {
  try {
    console.log("Starting withdrawal process...");
    
    const body = await request.json();
    console.log("Request body:", body);
    
    // Validate request body
    const { withdrawalAmount, cryptoType, walletAddress } = withdrawalSchema.parse(body);

    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      console.error("User not authenticated");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get user details
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.user.id)
    });

    if (!user) {
      console.error("User not found:", session.user.id);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check user balance
    if (user.balance < withdrawalAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create withdrawal request
    console.log("Creating pending withdrawal record...");
    const pendingWithdrawal = await db.transaction(async (tx) => {
      // Create pending withdrawal
      const [withdrawal] = await tx.insert(pendingWithdrawals).values({
        id: `pw_${Date.now()}`,
        userId: session.user.id,
        amount: withdrawalAmount,
        cryptoType,
        walletAddress,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Create transaction history record
      await tx.insert(transactionHistory).values({
        id: `th_${Date.now()}`,
        userId: session.user.id,
        type: TransactionTypeEnum.Withdrawal,
        amount: withdrawalAmount,
        description: `Pending withdrawal via ${cryptoType}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Update user balance
      // await tx.update(users)
      //   .set({ 
      //     balance: user.balance - withdrawalAmount,
      //     updatedAt: new Date()
      //   })
      //   .where(eq(users.id, session.user.id));

      return withdrawal;
    });

    console.log("Pending withdrawal created:", pendingWithdrawal);

    // Send email notifications
    if (process.env.RESEND_API_KEY) {
      try {
        await Promise.all([
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "Withdrawal Request Received",
            react: WithdrawalEmail({
              userFirstName: user.firstName || user.email,
              amount: withdrawalAmount.toString(),
              type: cryptoType,
              status: "pending",
              transactionDate: new Date().toISOString(),
              withdrawalId: pendingWithdrawal.id,
              walletAddress,
              cryptoType,
              isAdminCopy: false
            })
          }),
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: process.env.ADMIN_EMAIL!,
            subject: "New Withdrawal Request",
            react: WithdrawalEmail({
              userFirstName: user.firstName || user.email,
              amount: withdrawalAmount.toString(),
              type: cryptoType,
              status: "pending",
              transactionDate: new Date().toISOString(),
              withdrawalId: pendingWithdrawal.id,
              walletAddress,
              cryptoType,
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
      message: "Withdrawal request submitted successfully",
      pendingWithdrawal
    });

  } catch (error) {
    console.error("Withdrawal error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const withdrawals = await db
      .select()
      .from(pendingWithdrawals)
      .where(
        and(
          eq(pendingWithdrawals.userId, session.user.id),
          status ? eq(pendingWithdrawals.status, status) : undefined
        )
      )
      .orderBy(desc(pendingWithdrawals.createdAt));

    return NextResponse.json({ withdrawals });
    
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
