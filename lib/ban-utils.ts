import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function checkUserBanStatus(userId: string): Promise<boolean> {
  try {
    const userData = await db
      .select({ banned: users.banned })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return userData[0]?.banned || false;
  } catch (error) {
    console.error("Error checking ban status:", error);
    return false;
  }
}

export async function isUserBanned(userId: string): Promise<boolean> {
  return await checkUserBanStatus(userId);
}
