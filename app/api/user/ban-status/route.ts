import { NextRequest, NextResponse } from "next/server";
import { getUserAuth } from "@/lib/auth/utils";
import { checkUserBanStatus } from "@/lib/ban-utils";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ banned: false });
    }

    // Check if user is banned using utility function
    const isBanned = await checkUserBanStatus(session.user.id);

    return NextResponse.json({ 
      banned: isBanned,
      userId: session.user.id 
    });

  } catch (error) {
    console.error("Error checking ban status:", error);
    return NextResponse.json({ banned: false });
  }
}
