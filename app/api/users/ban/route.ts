import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";

export async function PATCH(request: NextRequest) {
  try {
    // Get authenticated user
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, banned } = await request.json();

    if (!userId || typeof banned !== "boolean") {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Update the user's banned status
    await db
      .update(users)
      .set({ 
        banned,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ 
      success: true, 
      message: banned ? "User banned successfully" : "User unbanned successfully" 
    });

  } catch (error) {
    console.error("Error updating user ban status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
