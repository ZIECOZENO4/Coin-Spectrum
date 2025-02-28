// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { handleError } from "@/middleware/errorHandler";

export async function GET() {
  try {
    const { session } = await getUserAuth();

    const allUsers = await db.select().from(users);
    
    return NextResponse.json({
      success: true,
      users: allUsers.map(user => ({
        ...user,
        balance: Number(user.balance)
      }))
    });

  } catch (error) {
    return handleError(error);
  }
}
