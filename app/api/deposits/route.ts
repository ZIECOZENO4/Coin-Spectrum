import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { DepositEmail } from "@/emails/DepositEmail";
import { eq } from "drizzle-orm";
import { transactionHistory, userTrackers } from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { userName, userEmail, amount, transactionId, imageData, selectedCrypto } = await req.json();

    const transaction = await db.insert(transactionHistory).values({
      id: transactionId,
      userId: userEmail,
      type: "deposit",
      amount: parseFloat(amount),
      description: `Deposit via ${selectedCrypto}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    const existingTracker = await db.select().from(userTrackers).where(eq(userTrackers.userId, userEmail));

    if (existingTracker.length > 0) {
      await db.update(userTrackers)
        .set({ 
          balance: existingTracker[0].balance + parseFloat(amount),
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

    // Email sending logic remains the same
    await resend.emails.send({
      from: "deposits@yourdomain.com",
      to: "admin@yourdomain.com",
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

    return NextResponse.json({ success: true, transaction: transaction[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process deposit" },
      { status: 500 }
    );
  }
}
