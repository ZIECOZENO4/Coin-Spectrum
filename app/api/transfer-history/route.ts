// app/api/transfer-history/route.ts
import { db } from "@/lib/db";
import { transferHistory, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    console.log('[TRANSFER-API] Authentication userId:', userId);

    if (!userId) {
      console.error('[TRANSFER-API] Unauthorized access attempt');
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log('[TRANSFER-API] Fetching transfers for user:', userId);
    
    const transfers = await db
      .select({
        transfer: transferHistory,
        sender: users,
        receiver: users,
      })
      .from(transferHistory)
      .innerJoin(users, eq(transferHistory.senderId, users.id))
      .innerJoin(users, eq(transferHistory.receiverId, users.id))
      .where(or(
        eq(transferHistory.senderId, userId),
        eq(transferHistory.receiverId, userId)
      ))
      .orderBy(transferHistory.createdAt);

    console.log('[TRANSFER-API] Raw database response:', transfers);

    const formattedTransfers = transfers.map(t => ({
      ...t.transfer,
      sender: t.sender,
      receiver: t.receiver
    }));

    console.log('[TRANSFER-API] Formatted transfers:', formattedTransfers);
    return NextResponse.json(formattedTransfers);

  } catch (error) {
    console.error("[TRANSFER-API] Error details:", error);
    return new NextResponse(JSON.stringify({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    }), { status: 500 });
  }
}
