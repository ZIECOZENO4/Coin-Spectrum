// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { Resend } from "resend";
// import { WithdrawalEmail } from "@/emails/withdrawal-email";
// import { getUserAuth } from "@/lib/auth/utils";
// import { eq, and, desc } from "drizzle-orm";
// import { z } from "zod";
// import { 
//   users, 
//   pendingWithdrawals,
//   transactionHistory,
//   TransactionTypeEnum
// } from "@/lib/db/schema";

// const resend = new Resend(process.env.RESEND_API_KEY);

// // Validation schema
// const withdrawalSchema = z.object({
//   withdrawalAmount: z.coerce.number().positive(), // Must match frontend
//   cryptoType: z.string().min(1),
//   walletAddress: z.string().min(10)
// });

// export async function POST(request: NextRequest) {
//   try {
//     console.log("Starting withdrawal process...");
    
//     const body = await request.json();
//     console.log("Request body:", body);
//     const rawData = await request.json();
//     // Validate request body
//     const { withdrawalAmount, cryptoType, walletAddress } = withdrawalSchema.parse(body);

//     const { session } = await getUserAuth();
//     if (!session?.user?.id) {
//       console.error("User not authenticated");
//       return NextResponse.json(
//         { error: "User not authenticated" },
//         { status: 401 }
//       );
//     }
//     const parsedData = {
//       ...rawData,
//       withdrawalAmount: Number(rawData.withdrawalAmount)
//     };

//     // Get user details
//     const user = await db.query.users.findFirst({
//       where: (users, { eq }) => eq(users.id, session.user.id)
//     });

//     if (!user) {
//       console.error("User not found:", session.user.id);
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Check user balance
//     if (user.balance < withdrawalAmount) {
//       return NextResponse.json(
//         { error: "Insufficient balance" },
//         { status: 400 }
//       );
//     }

//     // Create withdrawal request
//     console.log("Creating pending withdrawal record...");
//     const pendingWithdrawal = await db.transaction(async (tx) => {
//       // Create pending withdrawal
//       const [withdrawal] = await tx.insert(pendingWithdrawals).values({
//         id: `pw_${Date.now()}`,
//         userId: session.user.id,
//         amount: withdrawalAmount,
//         cryptoType,
//         walletAddress,
//         status: "pending",
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }).returning();

//       // Create transaction history record
//       await tx.insert(transactionHistory).values({
//         id: `th_${Date.now()}`,
//         userId: session.user.id,
//         type: TransactionTypeEnum.Withdrawal,
//         amount: withdrawalAmount,
//         description: `Successful withdrawal via ${cryptoType}`,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });

//       // Update user balance
//       // await tx.update(users)
//       //   .set({ 
//       //     balance: user.balance - withdrawalAmount,
//       //     updatedAt: new Date()
//       //   })
//       //   .where(eq(users.id, session.user.id));

//       return withdrawal;
//     });

//     console.log("Pending withdrawal created:", pendingWithdrawal);

//     // Send email notifications
//     if (process.env.RESEND_API_KEY) {
//       try {
//         await Promise.all([
//           resend.emails.send({
//             from: process.env.RESEND_FROM_EMAIL!,
//             to: user.email,
//             subject: "Withdrawal Request Received",
//             react: WithdrawalEmail({
//               userFirstName: user.firstName || user.email,
//               amount: withdrawalAmount.toString(),
//               type: cryptoType,
//               status: "pending",
//               transactionDate: new Date().toISOString(),
//               withdrawalId: pendingWithdrawal.id,
//               walletAddress,
//               cryptoType,
//               isAdminCopy: false
//             })
//           }),
//           resend.emails.send({
//             from: process.env.RESEND_FROM_EMAIL!,
//             to: process.env.ADMIN_EMAIL!,
//             subject: "New Withdrawal Request",
//             react: WithdrawalEmail({
//               userFirstName: user.firstName || user.email,
//               amount: withdrawalAmount.toString(),
//               type: cryptoType,
//               status: "pending",
//               transactionDate: new Date().toISOString(),
//               withdrawalId: pendingWithdrawal.id,
//               walletAddress,
//               cryptoType,
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
//       message: "Withdrawal request submitted successfully",
//       pendingWithdrawal
//     });

//   } catch (error) {
//     console.error("Withdrawal error:", error);
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: "Invalid request data", details: error.errors },
//         { status: 400 }
//       );
//     }
    
//     if (error instanceof Error) {
//       return NextResponse.json(
//         { error: error.message },
//         { status: 500 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: "An unexpected error occurred" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = req.nextUrl;
//     const status = searchParams.get("status");
    
//     const { session } = await getUserAuth();
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "User not authenticated" },
//         { status: 401 }
//       );
//     }

//     const withdrawals = await db
//       .select()
//       .from(pendingWithdrawals)
//       .where(
//         and(
//           eq(pendingWithdrawals.userId, session.user.id),
//           status ? eq(pendingWithdrawals.status, status) : undefined
//         )
//       )
//       .orderBy(desc(pendingWithdrawals.createdAt));

//     return NextResponse.json({ withdrawals });
    
//   } catch (error) {
//     console.error("Error fetching withdrawals:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch withdrawals" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { WithdrawalEmail } from "@/emails/withdrawal-email";
import { getUserAuth } from "@/lib/auth/utils";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import { 
  users, 
  pendingWithdrawals,
  transactionHistory,
  TransactionTypeEnum
} from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const withdrawalSchema = z.object({
  withdrawalAmount: z.coerce.number()
    .positive("Amount must be positive")
    .refine(val => val >= 0.01, "Minimum withdrawal is $0.01"),
  cryptoType: z.string().min(1, "Select cryptocurrency"),
  walletAddress: z.string()
    .min(10, "Wallet address must be at least 10 characters")
    .max(255, "Wallet address too long")
});

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json();
    
    // Add type coercion and validation
    const validationResult = withdrawalSchema.safeParse({
      ...rawData,
      withdrawalAmount: Number(rawData.withdrawalAmount)
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { withdrawalAmount, cryptoType, walletAddress } = validationResult.data;
    const { session } = await getUserAuth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user with balance check
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        id: true,
        balance: true,
        email: true,
        firstName: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    if (user.balance < withdrawalAmount) {
      return NextResponse.json(
        { 
          error: "Insufficient funds",
          currentBalance: user.balance,
          requiredAmount: withdrawalAmount
        },
        { status: 400 }
      );
    }

    // Database transaction
    const pendingWithdrawal = await db.transaction(async (tx) => {
      const [withdrawal] = await tx.insert(pendingWithdrawals).values({
        id: `pw_${Date.now()}`,
        userId: session.user.id,
        amount: withdrawalAmount,
        cryptoType,
        walletAddress,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      await tx.insert(transactionHistory).values({
        id: `th_${Date.now()}`,
        userId: session.user.id,
        type: TransactionTypeEnum.Withdrawal,
        amount: -withdrawalAmount,
        description: `Withdrawal request for ${cryptoType} to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}, this withdrawal will reflect within 24 hours.`,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return withdrawal;
    });

    // Email notifications
    if (process.env.RESEND_API_KEY) {
      try {
        const emailData = {
          userFirstName: user.firstName || "Customer",
          amount: withdrawalAmount.toFixed(2),
          type: cryptoType, // Add required 'type' prop
          status: "pending", // Add required 'status' prop
          cryptoType,
          walletAddress,
          withdrawalId: pendingWithdrawal.id,
          transactionDate: new Date().toISOString()
        };

        await Promise.all([
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "Withdrawal Request Received",
            react: WithdrawalEmail({ ...emailData, isAdminCopy: false })
          }),
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: process.env.ADMIN_EMAIL!,
            subject: "New Withdrawal Request",
            react: WithdrawalEmail({ ...emailData, isAdminCopy: true })
          })
        ]);
      } catch (emailError) {
        console.error("Email dispatch error:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        withdrawalId: pendingWithdrawal.id,
        amount: withdrawalAmount,
        timestamp: new Date().toISOString(),
        newBalance: user.balance - withdrawalAmount
      }
    });

  } catch (error) {
    console.error("Withdrawal processing error:", error);
    
    const errorResponse = {
      error: "Transaction failed",
      message: "Could not process withdrawal request",
      timestamp: new Date().toISOString()
    };

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ...errorResponse, details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}

// GET endpoint remains unchanged
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const withdrawals = await db
      .select()
      .from(pendingWithdrawals)
      .where(
        and(
          eq(pendingWithdrawals.userId, session.user.id),
          status ? eq(pendingWithdrawals.status, status) : undefined
        )
      )
      .orderBy(desc(pendingWithdrawals.createdAt));

    return NextResponse.json({ withdrawals });
    
  } catch (error) {
    console.error("Withdrawal history error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve transaction history" },
      { status: 500 }
    );
  }
}
