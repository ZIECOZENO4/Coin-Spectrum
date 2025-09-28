import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { sendUserActionEmails } from "@/lib/email-utils";

export async function PATCH(request: NextRequest) {
  try {
    // Get authenticated user
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, banned, reason } = await request.json();

    if (!userId || typeof banned !== "boolean") {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 });
    }

    // Get user details for email
    const userDetails = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userDetails[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's banned status
    await db
      .update(users)
      .set({ 
        banned,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Send email notifications
    try {
      const emailResult = await sendUserActionEmails({
        action: banned ? 'ban' : 'unban',
        userName: userDetails[0].fullName || userDetails[0].firstName || 'User',
        userEmail: userDetails[0].email,
        reason: reason.trim(),
        adminName: session.user.firstName || 'Admin',
        adminEmail: process.env.ADMIN_EMAIL || 'admin@coinspectrum.net'
      });

      if (!emailResult.success) {
        console.error('Failed to send email notifications:', emailResult.error);
        // Don't fail the request if email fails, just log it
      }
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({ 
      success: true, 
      message: banned ? "User banned successfully" : "User unbanned successfully",
      emailSent: true
    });

  } catch (error) {
    console.error("Error updating user ban status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
