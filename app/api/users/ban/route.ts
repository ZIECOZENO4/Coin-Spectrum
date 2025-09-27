import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabaseClient";

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the current user is an admin
    const currentUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!currentUser[0] || currentUser[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
