


// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  users, 
  userTrackers, 
  userReferrals, 
  userInvestments, 
  transactionHistory, 
  transferHistory, 
  pendingDeposits, 
  pendingWithdrawals, 
  kyc, 
  withdrawals, 
  userCopyTrades, 
  signalPurchases, 
  trades, 
  investmentProfitPayouts 
} from "@/lib/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { sendUserActionEmails } from "@/lib/email-utils";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";

  try {
    const baseCondition = search ? 
      or(
        ilike(users.fullName, `%${search}%`),
        ilike(users.email, `%${search}%`),
        ilike(users.username, `%${search}%`)
      ) : undefined;

    const usersList = await db
      .select()
      .from(users)
      .where(baseCondition)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({ users: usersList });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Add authentication check
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const { userId, balance } = await req.json();

    if (!userId || typeof balance !== "number") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Update user balance
    const [updatedUser] = await db
      .update(users)
      .set({ 
        balance,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        balance: Number(updatedUser.balance)
      }
    });

  } catch (error) {
    console.error("Error updating user balance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Add authentication check
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("id");
    const reason = searchParams.get("reason");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 }
      );
    }

    // Check if user exists first
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!existingUser[0]) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Send email notifications BEFORE deleting the user
    try {
      const emailResult = await sendUserActionEmails({
        action: 'delete',
        userName: existingUser[0].fullName || existingUser[0].firstName || 'User',
        userEmail: existingUser[0].email,
        reason: reason.trim(),
        adminName: session.user.firstName || 'Admin',
        adminEmail: process.env.ADMIN_EMAIL || 'admin@coinspectrum.net'
      });

      if (!emailResult.success) {
        console.error('Failed to send email notifications:', emailResult.error);
        // Don't fail the request if email fails, just log it
      }
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError);
      // Don't fail the request if email fails, just log it
    }

    // Start a transaction to handle foreign key constraints
    await db.transaction(async (tx) => {
      // Delete all related records first to avoid foreign key constraint violations
      // Delete user trackers
      await tx.delete(userTrackers).where(eq(userTrackers.userId, userId));
      
      // Delete user referrals (both as referrer and referred user)
      await tx.delete(userReferrals).where(eq(userReferrals.referrerId, userId));
      await tx.delete(userReferrals).where(eq(userReferrals.referredUserId, userId));
      
      // Delete user investments
      await tx.delete(userInvestments).where(eq(userInvestments.userId, userId));
      
      // Delete transaction history
      await tx.delete(transactionHistory).where(eq(transactionHistory.userId, userId));
      
      // Delete transfer history (both as sender and receiver)
      await tx.delete(transferHistory).where(eq(transferHistory.senderId, userId));
      await tx.delete(transferHistory).where(eq(transferHistory.receiverId, userId));
      
      // Delete pending deposits
      await tx.delete(pendingDeposits).where(eq(pendingDeposits.userId, userId));
      
      // Delete pending withdrawals
      await tx.delete(pendingWithdrawals).where(eq(pendingWithdrawals.userId, userId));
      
      // Delete KYC records
      await tx.delete(kyc).where(eq(kyc.userId, userId));
      
      // Delete withdrawals
      await tx.delete(withdrawals).where(eq(withdrawals.userId, userId));
      
      // Delete user copy trades
      await tx.delete(userCopyTrades).where(eq(userCopyTrades.userId, userId));
      
      // Delete signal purchases
      await tx.delete(signalPurchases).where(eq(signalPurchases.userId, userId));
      
      // Delete trades
      await tx.delete(trades).where(eq(trades.userId, userId));
      
      // Delete investment profit payouts
      await tx.delete(investmentProfitPayouts).where(eq(investmentProfitPayouts.userId, userId));
      
      // Finally, delete the user
      await tx.delete(users).where(eq(users.id, userId));
    });

    return NextResponse.json({
      success: true,
      message: "User and all related data deleted successfully",
      emailSent: true
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}