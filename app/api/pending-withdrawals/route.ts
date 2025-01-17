import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withdrawals } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching pending withdrawals...");
    
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      console.error("User not authenticated");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get pending withdrawals
    const pendingWithdrawals = await db
      .select()
      .from(withdrawals)
      .where(
        and(
          eq(withdrawals.userId, session.user.id),
          eq(withdrawals.status, "PENDING")
        )
      )
      .orderBy(desc(withdrawals.createdAt));

    console.log("Pending withdrawals fetched:", pendingWithdrawals);

    return NextResponse.json({
      success: true,
      withdrawals: pendingWithdrawals
    });

  } catch (error) {
    console.error("Failed to fetch pending withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
