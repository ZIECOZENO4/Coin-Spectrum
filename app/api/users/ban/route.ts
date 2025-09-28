import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { sendUserActionEmails } from "@/lib/email-utils";

export async function PATCH(request: NextRequest) {
  console.log("🔍 Ban API: PATCH request received");
  try {
    // Get authenticated user
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      console.log("❌ Ban API: No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, banned, reason } = await request.json();
    console.log("📊 Ban API: Request data:", { userId, banned, reason, adminId: session.user.id });

    if (!userId || typeof banned !== "boolean") {
      console.log("❌ Ban API: Invalid request data");
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    if (!reason || reason.trim().length === 0) {
      console.log("❌ Ban API: Reason is required");
      return NextResponse.json({ error: "Reason is required" }, { status: 400 });
    }

    // Get user details for email
    console.log("👤 Ban API: Fetching user details for:", userId);
    const userDetails = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userDetails[0]) {
      console.log("❌ Ban API: User not found:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("📋 Ban API: User details found:", { 
      id: userDetails[0].id, 
      email: userDetails[0].email, 
      currentBannedStatus: userDetails[0].banned 
    });

    // Update the user's banned status
    console.log(`🔄 Ban API: ${banned ? 'BANNING' : 'UNBANNING'} user:`, userId);
    await db
      .update(users)
      .set({ 
        banned,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    console.log(`✅ Ban API: User ${banned ? 'BANNED' : 'UNBANNED'} successfully:`, userId);

    // Send email notifications
    console.log("📧 Ban API: Sending email notifications...");
    try {
      const emailResult = await sendUserActionEmails({
        action: banned ? 'ban' : 'unban',
        userName: userDetails[0].fullName || userDetails[0].firstName || 'User',
        userEmail: userDetails[0].email,
        reason: reason.trim(),
        adminName: session.user.firstName || 'Admin',
        adminEmail: 'coinspectrum40@gmail.com'
      });

      if (!emailResult.success) {
        console.error('❌ Ban API: Failed to send email notifications:', emailResult.error);
        // Don't fail the request if email fails, just log it
      } else {
        console.log('✅ Ban API: Email notifications sent successfully');
      }
    } catch (emailError) {
      console.error('💥 Ban API: Error sending email notifications:', emailError);
      // Don't fail the request if email fails, just log it
    }

    const response = { 
      success: true, 
      message: banned ? "User banned successfully" : "User unbanned successfully",
      emailSent: true
    };

    console.log("📤 Ban API: Returning success response:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("Error updating user ban status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
