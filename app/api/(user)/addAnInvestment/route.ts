// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { Resend } from "resend";
// import { 
//   investments, 
//   investmentPlans, 
//   investmentStatuses, 
//   imageProofs, 
//   users,
//   transactionHistory,
//   TransactionTypeEnum
// } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { getUserAuth } from "@/lib/auth/utils";
// import { InvestmentEmail } from "@/emails/InvestmentEmail";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(req: NextRequest) {
//   try {
//     console.log("Starting investment creation process...");
    
//     const body = await req.json();
//     console.log("Request body:", body);
    
//     const { id, amount } = body;

//     if (!id || !amount) {
//       console.error("Missing required fields:", { id, amount });
//       return NextResponse.json(
//         { error: "Investment ID and amount are required" },
//         { status: 400 }
//       );
//     }

//     const { session } = await getUserAuth();
//     if (!session?.user?.id) {
//       console.error("User not authenticated");
//       return NextResponse.json(
//         { error: "User not authenticated" },
//         { status: 401 }
//       );
//     }

//     // Get user and investment plan details
//     const [user, investmentPlan] = await Promise.all([
//       db.query.users.findFirst({
//         where: eq(users.id, session.user.id)
//       }),
//       db.query.investmentPlans.findFirst({
//         where: eq(investmentPlans.id, id)
//       })
//     ]);

//     if (!user) {
//       console.error("User not found:", session.user.id);
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (!investmentPlan) {
//       console.error("Investment plan not found:", id);
//       return NextResponse.json({ error: "Investment plan not found" }, { status: 404 });
//     }

//     if (user.balance < amount) {
//       console.error("Insufficient balance:", { required: amount, available: user.balance });
//       return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
//     }

//     console.log("Creating investment with transaction...");
//     const investment = await db.transaction(async (tx) => {
//       const [newInvestment] = await tx.insert(investments).values({
//         id: `inv_${Date.now()}`,
//         userId: session.user.id,
//         amount: amount,
//         planId: id,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }).returning();

//       await tx.update(users)
//         .set({
//           balance: user.balance - amount,
//           updatedAt: new Date()
//         })
//         .where(eq(users.id, session.user.id));

//       await tx.insert(transactionHistory).values({
//         id: `th_${Date.now()}`,
//         userId: session.user.id,
//         type: TransactionTypeEnum.Investment,
//         amount: amount,
//         description: `Investment in ${investmentPlan.name}`,
//         investmentId: newInvestment.id,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });

//       return newInvestment;
//     });

//     console.log("Investment created successfully:", investment);

//     if (process.env.RESEND_API_KEY) {
//       try {
//         await Promise.all([
//           resend.emails.send({
//             from: process.env.RESEND_FROM_EMAIL!,
//             to: user.email,
//             subject: "Investment Created Successfully",
//             react: InvestmentEmail({
//               userFirstName: user.firstName || user.email,
//               amount: amount.toString(),
//               planName: investmentPlan.name,
//               transactionId: investment.id,
//               isAdminCopy: false
//             })
//           }),
//           resend.emails.send({
//             from: process.env.RESEND_FROM_EMAIL!,
//             to: process.env.ADMIN_EMAIL!,
//             subject: "New Investment Created",
//             react: InvestmentEmail({
//               userFirstName: user.firstName || user.email,
//               amount: amount.toString(),
//               planName: investmentPlan.name,
//               transactionId: investment.id,
//               isAdminCopy: true
//             })
//           })
//         ]);
//         console.log("Email notifications sent successfully");
//       } catch (emailError) {
//         console.error("Failed to send email notifications:", emailError);
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Investment created successfully",
//       investment
//     });

//   } catch (error) {
//     console.error("Investment creation failed:", error);
//     return NextResponse.json(
//       { error: "Failed to create investment" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { 
  investments, 
  investmentPlans, 
  userInvestments,
  users,
  transactionHistory,
  TransactionTypeEnum,
  InvestmentNameEnum
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { InvestmentEmail } from "@/emails/InvestmentEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, amount } = body;

    if (!id || !amount) {
      return NextResponse.json(
        { error: "Investment ID and amount are required" },
        { status: 400 }
      );
    }

    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const [user, investmentPlan] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, session.user.id)
      }),
      db.query.investmentPlans.findFirst({
        where: eq(investmentPlans.id, id)
      })
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!investmentPlan) {
      return NextResponse.json({ error: "Investment plan not found" }, { status: 404 });
    }

    if (user.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const result = await db.transaction(async (tx) => {
      // Create investment record
      const [newInvestment] = await tx.insert(investments).values({
        id: `inv_${Date.now()}`,
        name: investmentPlan.name.toLowerCase() as InvestmentNameEnum,
        price: amount,
        profitPercent: investmentPlan.roi,
        rating: 0,
        principalReturn: true,
        principalWithdraw: investmentPlan.instantWithdrawal,
        creditAmount: amount,
        depositFee: "0",
        debitAmount: 0,
        durationDays: Math.floor(investmentPlan.durationHours / 24),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Create user investment record
      const [userInvestment] = await tx.insert(userInvestments).values({
        id: `ui_${Date.now()}`,
        userId: session.user.id,
        investmentId: newInvestment.id,
        amount: amount,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Update user balance
      await tx.update(users)
        .set({
          balance: user.balance - amount,
          updatedAt: new Date()
        })
        .where(eq(users.id, session.user.id));

      // Create transaction history
      await tx.insert(transactionHistory).values({
        id: `th_${Date.now()}`,
        userId: session.user.id,
        type: TransactionTypeEnum.Investment,
        amount: amount,
        description: `Investment in ${investmentPlan.name}`,
        investmentId: newInvestment.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return { newInvestment, userInvestment };
    });

    if (process.env.RESEND_API_KEY) {
      try {
        await Promise.all([
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "Investment Created Successfully",
            react: InvestmentEmail({
              userFirstName: user.firstName || user.email,
              amount: amount.toString(),
              planName: investmentPlan.name,
              transactionId: result.newInvestment.id,
              isAdminCopy: false
            })
          }),
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: process.env.ADMIN_EMAIL!,
            subject: "New Investment Created",
            react: InvestmentEmail({
              userFirstName: user.firstName || user.email,
              amount: amount.toString(),
              planName: investmentPlan.name,
              transactionId: result.newInvestment.id,
              isAdminCopy: true
            })
          })
        ]);
      } catch (emailError) {
        console.error("Failed to send email notifications:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Investment created successfully",
      data: result
    });

  } catch (error) {
    console.error("Investment creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
