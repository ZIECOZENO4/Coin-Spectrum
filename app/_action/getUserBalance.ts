// // lib/db.ts
// import { prisma } from "@/lib/db/prisma";

// export async function getUserBalance(userId: string): Promise<number> {
//   const userTracker = await prisma.userTracker.findUnique({
//     where: { userId },
//     select: { balance: true },
//   });

//   if (!userTracker) {
//     throw new Error("User tracker not found");
//   }

//   return userTracker.balance;
// }

// lib/db.ts
import { db } from "@/lib/db";
import { userTrackers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserBalance(userId: string): Promise<number> {
  const userTracker = await db.select({ balance: userTrackers.balance })
    .from(userTrackers)
    .where(eq(userTrackers.userId, userId))
    .limit(1);

  if (!userTracker.length) {
    throw new Error("User tracker not found");
  }

  return userTracker[0].balance;
}
