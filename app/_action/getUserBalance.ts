// lib/db.ts
import { prisma } from "@/lib/db/prisma";

export async function getUserBalance(userId: string): Promise<number> {
  const userTracker = await prisma.userTracker.findUnique({
    where: { userId },
    select: { balance: true },
  });

  if (!userTracker) {
    throw new Error("User tracker not found");
  }

  return userTracker.balance;
}
