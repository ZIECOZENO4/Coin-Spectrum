import { NextRequest, NextResponse } from "next/server";
import { getUserAuth } from "@/lib/auth/utils";
import { checkUserBanStatus } from "@/lib/ban-utils";

export async function GET(request: NextRequest) {
  console.log("🔍 Ban Status API: Request received");
  try {
    // Get authenticated user
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      console.log("❌ Ban Status API: No authenticated user found");
      return NextResponse.json({ banned: false });
    }

    console.log("👤 Ban Status API: Checking ban status for user:", session.user.id);

    // Check if user is banned using utility function
    const isBanned = await checkUserBanStatus(session.user.id);

    console.log("📊 Ban Status API: User ban status:", isBanned);

    const response = {
      banned: isBanned,
      userId: session.user.id 
    };

    console.log("📤 Ban Status API: Returning response:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("💥 Ban Status API: Error checking ban status:", error);
    return NextResponse.json({ banned: false });
  }
}
