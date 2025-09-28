import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function checkUserBanStatus(userId: string): Promise<boolean> {
  console.log("🔍 Ban Utils: Checking ban status for user:", userId);
  try {
    const userData = await db
      .select({ banned: users.banned })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const isBanned = userData[0]?.banned || false;
    console.log("📊 Ban Utils: Database query result:", { userId, isBanned, userData });
    
    return isBanned;
  } catch (error) {
    console.error("💥 Ban Utils: Error checking ban status:", error);
    return false;
  }
}

export async function isUserBanned(userId: string): Promise<boolean> {
  return await checkUserBanStatus(userId);
}
