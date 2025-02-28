// app/api/users/[userId]/balance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { handleError } from "@/middleware/errorHandler";
import { getUserAuth } from "@/lib/auth/utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Authentication
    const { session } = await getUserAuth();
    if (!session?.user?.id) return NextResponse.json(
      { success: false, error: "Unauthorized" }, 
      { status: 401 }
    );

    // Authorization
    const adminUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });
    if (adminUser?.role !== "admin") return NextResponse.json(
      { success: false, error: "Admin access required" },
      { status: 403 }
    );

    // Validation
    if (!params.userId) return NextResponse.json(
      { success: false, error: "Missing user ID" },
      { status: 400 }
    );

    const { balance } = await req.json();
    if (typeof balance !== "number") return NextResponse.json(
      { success: false, error: "Invalid balance format" },
      { status: 400 }
    );

    // Update balance
    const [updatedUser] = await db.update(users)
      .set({ 
        balance,
        updatedAt: new Date()
      })
      .where(eq(users.id, params.userId))
      .returning();

    if (!updatedUser) return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        balance: Number(updatedUser.balance)
      }
    });

  } catch (error) {
    return handleError(error);
  }
}
