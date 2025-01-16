import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { DepositEmail } from "@/emails/DepositEmail";
import { transactionHistory, userTrackers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { userName, userEmail, amount, transactionId, imageData, selectedCrypto } = await req.json();

    const transaction = await db.insert(transactionHistory).values({
        id: transactionId,
        userId: userEmail,
        type: "deposit", // Using the TransactionType enum
        amount: parseFloat(amount),
        description: `Deposit via ${selectedCrypto}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      

    // Update or create user tracker
    const existingTracker = await db.query.userTrackers.findFirst({
      where: (userTrackers, { eq }) => eq(userTrackers.userId, userEmail)
    });

    if (existingTracker) {
      await db.update(userTrackers)
        .set({
          balance: existingTracker.balance + parseFloat(amount),
          updatedAt: new Date()
        })
        .where(eq(userTrackers.userId, userEmail));
    } else {
      await db.insert(userTrackers).values({
        id: `ut_${transactionId}`,
        userId: userEmail,
        balance: parseFloat(amount),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Send email notification
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

    return NextResponse.json({ 
      success: true, 
      message: "Deposit submitted successfully",
      transaction 
    });

  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      { error: "Failed to process deposit. Please try again." },
      { status: 500 }
    );
  }
}
