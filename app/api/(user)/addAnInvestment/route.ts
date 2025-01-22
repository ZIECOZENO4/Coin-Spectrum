// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { Resend } from "resend";
// import { 
//   investments, 
//   investmentPlans, 
//   userInvestments,
//   users,
//   transactionHistory,
//   TransactionTypeEnum,
//   InvestmentNameEnum
// } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { getUserAuth } from "@/lib/auth/utils";
// import { InvestmentEmail } from "@/emails/InvestmentEmail";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { id, amount } = body;

//     if (!id || !amount) {
//       return NextResponse.json(
//         { error: "Investment ID and amount are required" },
//         { status: 400 }
//       );
//     }

//     const { session } = await getUserAuth();
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "User not authenticated" },
//         { status: 401 }
//       );
//     }

//     const [user, investmentPlan] = await Promise.all([
//       db.query.users.findFirst({
//         where: eq(users.id, session.user.id)
//       }),
//       db.query.investmentPlans.findFirst({
//         where: eq(investmentPlans.id, id)
//       })
//     ]);

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (!investmentPlan) {
//       return NextResponse.json({ error: "Investment plan not found" }, { status: 404 });
//     }

//     if (user.balance < amount) {
//       return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
//     }

//     const result = await db.transaction(async (tx) => {
//       // Create investment record
//       const [newInvestment] = await tx.insert(investments).values({
//         id: `inv_${Date.now()}`,
//         name: investmentPlan.name.toLowerCase() as InvestmentNameEnum,
//         price: amount,
//         profitPercent: investmentPlan.roi,
//         rating: 0,
//         principalReturn: true,
//         principalWithdraw: investmentPlan.instantWithdrawal,
//         creditAmount: amount,
//         depositFee: "0",
//         debitAmount: 0,
//         durationDays: Math.floor(investmentPlan.durationHours / 24),
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }).returning();

//       // Create user investment record
//       const [userInvestment] = await tx.insert(userInvestments).values({
//         id: `ui_${Date.now()}`,
//         userId: session.user.id,
//         investmentId: newInvestment.id,
//         amount: amount,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }).returning();

//       // Update user balance
//       await tx.update(users)
//         .set({
//           balance: user.balance - amount,
//           updatedAt: new Date()
//         })
//         .where(eq(users.id, session.user.id));

//       // Create transaction history
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

//       return { newInvestment, userInvestment };
//     });

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
//               transactionId: result.newInvestment.id,
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
//               transactionId: result.newInvestment.id,
//               isAdminCopy: true
//             })
//           })
//         ]);
//       } catch (emailError) {
//         console.error("Failed to send email notifications:", emailError);
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Investment created successfully",
//       data: result
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

interface InvestmentRequest {
  id: string;
  amount: number;
  userName?: string;
  userEmail?: string;
  imageUrl?: string;
  imageId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InvestmentRequest;
    console.log("Received investment request:", body);

    // Validate input
    if (!body.id || typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid investment parameters" },
        { status: 400 }
      );
    }

    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user and investment plan
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });

    const investmentPlan = await db.query.investmentPlans.findFirst({
      where: eq(investmentPlans.id, body.id)
    });

    if (!user || !investmentPlan) {
      return NextResponse.json(
        { error: !user ? "User not found" : "Investment plan not found" },
        { status: 404 }
      );
    }

    if (user.balance < body.amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Generate unique IDs
    const investmentId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userInvestmentId = `ui_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const transactionId = `th_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Create investment record
    const [newInvestment] = await db.insert(investments).values({
      id: investmentId,
      name: investmentPlan.name.toLowerCase() as InvestmentNameEnum,
      price: body.amount,
      profitPercent: investmentPlan.roi,
      rating: 0,
      principalReturn: true,
      principalWithdraw: investmentPlan.instantWithdrawal,
      creditAmount: body.amount,
      depositFee: "0",
      debitAmount: 0,
      durationDays: Math.floor(investmentPlan.durationHours / 24),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Create user investment record
    const [userInvestment] = await db.insert(userInvestments).values({
      id: userInvestmentId,
      userId: session.user.id,
      investmentId: newInvestment.id,
      amount: body.amount,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Update user balance
    await db.update(users)
      .set({
        balance: user.balance - body.amount,
        updatedAt: new Date()
      })
      .where(eq(users.id, session.user.id));

    // Create transaction history
    await db.insert(transactionHistory).values({
      id: transactionId,
      userId: session.user.id,
      type: TransactionTypeEnum.Investment,
      amount: body.amount,
      description: `Investment in ${investmentPlan.name}`,
      investmentId: newInvestment.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Send email notifications
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && user.email) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: user.email,
          subject: "Investment Created Successfully",
          react: InvestmentEmail({
            userFirstName: user.firstName || user.email,
            amount: body.amount.toString(),
            planName: investmentPlan.name,
            transactionId: newInvestment.id,
            isAdminCopy: false
          })
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Investment created successfully",
      data: {
        investment: newInvestment,
        userInvestment: userInvestment
      }
    });

  } catch (error) {
    console.error("Investment creation failed:", error);
    return NextResponse.json(
      { 
        error: "Failed to create investment",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
