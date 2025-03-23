// app/api/transfer-history/route.ts
import { db } from "@/lib/db";
import { transferHistory, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { alias } from 'drizzle-orm/pg-core';


export async function GET() {
  try {
    const { userId } = auth();
    console.log('[TRANSFER-API] Authentication userId:', userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create aliases for sender and receiver
    const sender = alias(users, "sender");
    const receiver = alias(users, "receiver");

    const transfers = await db
      .select({
        transfer: transferHistory,
        sender: sender,
        receiver: receiver,
      })
      .from(transferHistory)
      .innerJoin(sender, eq(transferHistory.senderId, sender.id))
      .innerJoin(receiver, eq(transferHistory.receiverId, receiver.id))
      .where(or(
        eq(transferHistory.senderId, userId),
        eq(transferHistory.receiverId, userId)
      ))
      .orderBy(transferHistory.createdAt);

    const formattedTransfers = transfers.map(t => ({
      ...t.transfer,
      sender: t.sender,
      receiver: t.receiver
    }));

    return NextResponse.json(formattedTransfers);

  } catch (error) {
    console.error("[TRANSFER-API] Error details:", error);
    return NextResponse.json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
