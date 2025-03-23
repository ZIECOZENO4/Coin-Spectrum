// app/api/transfer-history/route.ts
import { db } from "@/lib/db";
import { transferHistory, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transfers = await db
      .select({
        transfer: transferHistory,
        sender: users,
        receiver: users,
      })
      .from(transferHistory)
      .leftJoin(users, eq(transferHistory.senderId, users.id))
      .leftJoin(users, eq(transferHistory.receiverId, users.id))
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
    console.error("Error fetching transfer history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
