// // app/api/checkWithdrawalEligibility/route.ts
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { users, trades } from "@/lib/db/schema";
// import { getUserAuth } from "@/lib/auth/utils";
// import { eq, and, gte, sql } from "drizzle-orm";
// import { Resend } from "resend";
// import { WithdrawalApprovalEmail } from "@/emails/WithdrawalApprovalEmail";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function GET() {
//   try {
//     const { session } = await getUserAuth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const [user] = await db
//   .select({ 
//     withdrawalRequirement: users.withdrawalRequirement,
//     email: users.email,
//     fullName: users.fullName 
//   })
//   .from(users)
//   .where(eq(users.id, session.user.id));

//     const tradeCountResult = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(trades)
//       .where(eq(trades.userId, session.user.id));
      
//     const tradeCount = Number(tradeCountResult[0]?.count || 0);
//     const newStatus = tradeCount >= 3 ? "fulfilled" : "unfulfilled";
//     const statusChanged = user.withdrawalRequirement !== newStatus;

//     // Update user status
//     await db.update(users)
//       .set({ withdrawalRequirement: newStatus })
//       .where(eq(users.id, session.user.id));

//     // Send email only if status changed to fulfilled
//     if (newStatus === "fulfilled" && statusChanged) {
//       await resend.emails.send({
//         from: process.env.RESEND_FROM_EMAIL!,
//         to: user.email,
//         subject: "Withdrawal Requirements Met 🎉",
//         react: WithdrawalApprovalEmail({
//           userName: user.fullName || "Valued Client",
//           tradeCount
//         })
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       isEligible: newStatus === "fulfilled",
//       tradeCount,
//       requirementStatus: newStatus
//     });

//   } catch (error) {
//     console.error("Withdrawal check failed:", error);
//     return NextResponse.json(
//       { error: "Withdrawal check failed" },
//       { status: 500 }
//     );
//   }
// }

// app/api/checkWithdrawalEligibility/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, trades } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq, and, gte, sql } from "drizzle-orm";
import { Resend } from "resend";
import { WithdrawalApprovalEmail } from "@/emails/WithdrawalApprovalEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's current status
    const [user] = await db
      .select({ 
        withdrawalRequirement: users.withdrawalRequirement,
        email: users.email,
        fullName: users.fullName 
      })
      .from(users)
      .where(eq(users.id, session.user.id));

    // Get trade count
    const tradeCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(trades)
      .where(eq(trades.userId, session.user.id));
      
    const tradeCount = Number(tradeCountResult[0]?.count || 0);
    let newStatus = user.withdrawalRequirement;
    let statusChanged = false;

    // Only auto-update if not manually fulfilled
    if (user.withdrawalRequirement !== 'fulfilled') {
      const calculatedStatus = tradeCount >= 3 ? 'fulfilled' : 'unfulfilled';
      statusChanged = user.withdrawalRequirement !== calculatedStatus;
      newStatus = calculatedStatus;

      // Update only if status changed
      if (statusChanged) {
        await db.update(users)
          .set({ withdrawalRequirement: newStatus })
          .where(eq(users.id, session.user.id));
      }
    }

    // Send email only for automatic fulfillment changes
    if (newStatus === 'fulfilled' && statusChanged) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: "Withdrawal Requirements Met 🎉",
        react: WithdrawalApprovalEmail({
          userName: user.fullName || "Valued Client",
          tradeCount
        })
      });
    }

 // In your fetchEligibility response handling
return NextResponse.json({
  success: true,
  isEligible: newStatus === 'fulfilled',
  tradeCount,
  requirementStatus: newStatus,
  isManualOverride: user.withdrawalRequirement === 'fulfilled' && tradeCount < 3 // New flag
});


  } catch (error) {
    console.error("Withdrawal check failed:", error);
    return NextResponse.json(
      { error: "Withdrawal check failed" },
      { status: 500 }
    );
  }
}
