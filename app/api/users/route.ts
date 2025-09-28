


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
  console.log("🔍 Delete API: DELETE request received");
  try {
    // Add authentication check
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      console.log("❌ Delete API: No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("id");
    const reason = searchParams.get("reason");

    console.log("📊 Delete API: Request data:", { userId, reason, adminId: session.user.id });

    if (!userId) {
      console.log("❌ Delete API: User ID is required");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length === 0) {
      console.log("❌ Delete API: Reason is required");
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 }
      );
    }

    // Check if user exists first
    console.log("👤 Delete API: Checking if user exists:", userId);
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!existingUser[0]) {
      console.log("❌ Delete API: User not found:", userId);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("📋 Delete API: User found:", { 
      id: existingUser[0].id, 
      email: existingUser[0].email, 
      fullName: existingUser[0].fullName 
    });

    // Send email notifications BEFORE deleting the user
    console.log("📧 Delete API: Sending email notifications before deletion...");
    try {
      const emailResult = await sendUserActionEmails({
        action: 'delete',
        userName: existingUser[0].fullName || existingUser[0].firstName || 'User',
        userEmail: existingUser[0].email,
        reason: reason.trim(),
        adminName: session.user.firstName || 'Admin',
        adminEmail: 'coinspectrum40@gmail.com'
      });

      if (!emailResult.success) {
        console.error('❌ Delete API: Failed to send email notifications:', emailResult.error);
        // Don't fail the request if email fails, just log it
      } else {
        console.log('✅ Delete API: Email notifications sent successfully');
      }
    } catch (emailError) {
      console.error('💥 Delete API: Error sending email notifications:', emailError);
      // Don't fail the request if email fails, just log it
    }

    // Start a transaction to handle foreign key constraints
    console.log("🔄 Delete API: Starting database transaction to delete user and related data...");
    await db.transaction(async (tx) => {
      console.log("🗑️ Delete API: Deleting related records...");
      // Delete all related records first to avoid foreign key constraint violations
      // Delete user trackers
      await tx.delete(userTrackers).where(eq(userTrackers.userId, userId));
      console.log("✅ Delete API: Deleted userTrackers");
      
      // Delete user referrals (both as referrer and referred user)
      await tx.delete(userReferrals).where(eq(userReferrals.referrerId, userId));
      await tx.delete(userReferrals).where(eq(userReferrals.referredUserId, userId));
      console.log("✅ Delete API: Deleted userReferrals");
      
      // Delete user investments
      await tx.delete(userInvestments).where(eq(userInvestments.userId, userId));
      console.log("✅ Delete API: Deleted userInvestments");
      
      // Delete transaction history
      await tx.delete(transactionHistory).where(eq(transactionHistory.userId, userId));
      console.log("✅ Delete API: Deleted transactionHistory");
      
      // Delete transfer history (both as sender and receiver)
      await tx.delete(transferHistory).where(eq(transferHistory.senderId, userId));
      await tx.delete(transferHistory).where(eq(transferHistory.receiverId, userId));
      console.log("✅ Delete API: Deleted transferHistory");
      
      // Delete pending deposits
      await tx.delete(pendingDeposits).where(eq(pendingDeposits.userId, userId));
      console.log("✅ Delete API: Deleted pendingDeposits");
      
      // Delete pending withdrawals
      await tx.delete(pendingWithdrawals).where(eq(pendingWithdrawals.userId, userId));
      console.log("✅ Delete API: Deleted pendingWithdrawals");
      
      // Delete KYC records
      await tx.delete(kyc).where(eq(kyc.userId, userId));
      console.log("✅ Delete API: Deleted kyc");
      
      // Delete withdrawals
      await tx.delete(withdrawals).where(eq(withdrawals.userId, userId));
      console.log("✅ Delete API: Deleted withdrawals");
      
      // Delete user copy trades
      await tx.delete(userCopyTrades).where(eq(userCopyTrades.userId, userId));
      console.log("✅ Delete API: Deleted userCopyTrades");
      
      // Delete signal purchases
      await tx.delete(signalPurchases).where(eq(signalPurchases.userId, userId));
      console.log("✅ Delete API: Deleted signalPurchases");
      
      // Delete trades
      await tx.delete(trades).where(eq(trades.userId, userId));
      console.log("✅ Delete API: Deleted trades");
      
      // Delete investment profit payouts
      await tx.delete(investmentProfitPayouts).where(eq(investmentProfitPayouts.userId, userId));
      console.log("✅ Delete API: Deleted investmentProfitPayouts");
      
      // Finally, delete the user
      console.log("🗑️ Delete API: Deleting user record...");
      await tx.delete(users).where(eq(users.id, userId));
      console.log("✅ Delete API: User deleted successfully");
    });

    const response = {
      success: true,
      message: "User and all related data deleted successfully",
      emailSent: true
    };

    console.log("📤 Delete API: Returning success response:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("💥 Delete API: Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}