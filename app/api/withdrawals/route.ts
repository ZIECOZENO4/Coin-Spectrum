// app/api/admin/withdrawals/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { WithdrawalEmail } from "@/emails/WithdrawalEmail";
import { 
  pendingWithdrawals, 
  withdrawals, 
  users,
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    const withdrawalsList = await db
      .select()
      .from(pendingWithdrawals)
      .leftJoin(users, eq(pendingWithdrawals.userId, users.id))
      .limit(limit)
      .offset(skip);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(pendingWithdrawals);

    return NextResponse.json({
      withdrawals: withdrawalsList,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { withdrawalId, action, rejectionReason } = body;

    // First get the withdrawal and associated user
    const withdrawal = await db
      .select()
      .from(pendingWithdrawals)
      .where(eq(pendingWithdrawals.id, withdrawalId))
      .limit(1);

    if (!withdrawal || withdrawal.length === 0) {
      return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
    }

    // Get user details
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, withdrawal[0].userId))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "approve") {
      await db.transaction(async (tx) => {
        // Update user balance
        await tx
          .update(users)
          .set({
            balance: sql`balance - ${withdrawal[0].amount}`,
          })
          .where(eq(users.id, withdrawal[0].userId));

        // Create confirmed withdrawal
        await tx.insert(withdrawals).values({
          id: `w_${withdrawalId}`,
          userId: withdrawal[0].userId,
          amount: withdrawal[0].amount,
          cryptoType: withdrawal[0].cryptoType,
          walletAddress: withdrawal[0].walletAddress,
          status: "CONFIRMED",
        });

        // Delete pending withdrawal
        await tx
          .delete(pendingWithdrawals)
          .where(eq(pendingWithdrawals.id, withdrawalId));
      });

      // Send approval email
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user[0].email,
        subject: "Withdrawal Approved",
        react: WithdrawalEmail({
          userFirstName: user[0].firstName || "User",
          amount: withdrawal[0].amount.toString(),
          cryptoType: withdrawal[0].cryptoType,
          walletAddress: withdrawal[0].walletAddress,
          status: "approved",
          withdrawalId,
        }),
      });
    } else {
      // Handle rejection
      await db
        .update(pendingWithdrawals)
        .set({
          status: "rejected",
          rejectionReason,
          processedAt: new Date(),
        })
        .where(eq(pendingWithdrawals.id, withdrawalId));

      // Send rejection email
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user[0].email,
        subject: "Withdrawal Rejected",
        react: WithdrawalEmail({
          userFirstName: user[0].firstName || "User",
          amount: withdrawal[0].amount.toString(),
          cryptoType: withdrawal[0].cryptoType,
          walletAddress: withdrawal[0].walletAddress,
          status: "rejected",
          rejectionReason,
          withdrawalId,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Withdrawal processing error:", error);
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 });
  }
}
