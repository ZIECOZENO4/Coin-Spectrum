
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

    const userBalance = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        balance: true
      }
    });

    if (!userBalance) {
      return new Response("User not found", { status: 404 });
    }

    return Response.json({ balance: userBalance.balance });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
