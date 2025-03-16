// app/api/users/[userId]/withdrawal-status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { WithdrawalApprovalEmail } from "@/emails/WithdrawalApprovalEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { status } = await req.json();
    const userId = params.userId;

    const [user] = await db
      .update(users)
      .set({ withdrawalRequirement: status })
      .where(eq(users.id, userId))
      .returning();

    if (status === "fulfilled") {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: "Withdrawal Eligibility Approved 🎉",
        react: WithdrawalApprovalEmail({
          userName: user.fullName || "Valued Client",
          tradeCount: 0 // Update if you track admin-overridden trades
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Status update failed:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
