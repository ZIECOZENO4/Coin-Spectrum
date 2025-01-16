import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { DepositEmail } from "@/emails/DepositEmail";
import { transactionHistory, userTrackers, TransactionTypeEnum } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    console.log("Starting deposit process...");
    
    // Log request body
    const body = await req.json();
    console.log("Request body:", body);
    
    const { userName, userEmail, amount, transactionId, imageData, selectedCrypto } = body;

    // Validate required fields
    if (!userName || !userEmail || !amount || !transactionId || !selectedCrypto) {
      console.error("Missing required fields:", { userName, userEmail, amount, transactionId, selectedCrypto });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating transaction record...");
    // Create transaction with proper enum type
    const transaction = await db.insert(transactionHistory).values({
      id: transactionId,
      userId: userEmail,
      type: TransactionTypeEnum.Deposit, // Using the enum value
      amount: parseFloat(amount),
      description: `Deposit via ${selectedCrypto}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    console.log("Transaction created:", transaction);

    console.log("Checking for existing user tracker...");
    // Check existing tracker
    const existingTracker = await db.query.userTrackers.findFirst({
      where: (userTrackers, { eq }) => eq(userTrackers.userId, userEmail)
    });
    console.log("Existing tracker:", existingTracker);

    if (existingTracker) {
      console.log("Updating existing tracker...");
      await db.update(userTrackers)
        .set({
          balance: existingTracker.balance + parseFloat(amount),
          updatedAt: new Date()
        })
        .where(eq(userTrackers.userId, userEmail));
    } else {
      console.log("Creating new tracker...");
      await db.insert(userTrackers).values({
        id: `ut_${transactionId}`,
        userId: userEmail,
        balance: parseFloat(amount),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log("Sending email notification...");
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "deposits@coinspectrum.net",
          to: process.env.ADMIN_EMAIL || "admin@coinspectrum.net",
          subject: "New Deposit Pending Confirmation",
          react: DepositEmail({
            userFirstName: userName,
            amount: amount,
            type: selectedCrypto,
            status: "pending",
            transactionDate: new Date().toISOString(),
            depositId: transactionId,
            isAdminCopy: true
          }),
        });
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Continue execution even if email fails
      }
    } else {
      console.warn("RESEND_API_KEY not configured");
    }

    console.log("Deposit process completed successfully");
    return NextResponse.json({ 
      success: true, 
      message: "Deposit submitted successfully",
      transaction 
    });

} catch (err: unknown) {
    // Type guard for database-specific errors
    interface DbError {
      code: string;
      message: string;
    }
  
    const isDbError = (error: unknown): error is DbError => {
      return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as DbError).code === 'string'
      );
    };
  
    if (isDbError(err)) {
      switch (err.code) {
        case '23505':
          return NextResponse.json(
            { error: "Duplicate transaction ID" },
            { status: 400 }
          );
        case '23503':
          return NextResponse.json(
            { error: "Invalid user reference" },
            { status: 400 }
          );
        default:
          console.error("Database error:", err);
          return NextResponse.json(
            { error: "Database operation failed" },
            { status: 500 }
          );
      }
    }
  
    // Handle standard Error objects
    if (err instanceof Error) {
      return NextResponse.json(
        { 
          error: "Failed to process deposit",
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        },
        { status: 500 }
      );
    }
  
    // Handle unknown error types
    console.error("Unknown error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}