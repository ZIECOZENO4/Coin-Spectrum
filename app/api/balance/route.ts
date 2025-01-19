
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userBalance = await db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    if (!userBalance[0]) {
      return new Response("User not found", { status: 404 });
    }

    return Response.json({ balance: userBalance[0].balance });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
