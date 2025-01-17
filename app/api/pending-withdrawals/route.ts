// app/api/pending-withdrawals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withdrawals } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";

export async function GET(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const pendingWithdrawals = await db.query.withdrawals.findMany({
      where: and(
        eq(withdrawals.userId, session.user.id),
        eq(withdrawals.status, "PENDING")
      ),
      with: {
        user: true
      },
      orderBy: (withdrawals, { desc }) => [desc(withdrawals.createdAt)]
    });

    return NextResponse.json({ withdrawals: pendingWithdrawals });
  } catch (error) {
    console.error("Failed to fetch pending withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
