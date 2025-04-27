import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { DepositEmail } from "@/emails/DepositEmail";
import { transactionHistory, userTrackers, users, TransactionTypeEnum, pendingDeposits } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
      
      const body = await req.json();
      const { userName, userEmail, amount, transactionId, imageData, selectedCrypto } = body;
  
      if (!userName || !userEmail || !amount || !transactionId || !selectedCrypto || !imageData?.url) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
  
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, userEmail)
      });
  
      if (!existingUser) {
        return NextResponse.json(
          { error: "User not found. Please register first." },
          { status: 404 }
        );
      }
  
      // Create pending deposit record
      const pendingDeposit = await db.insert(pendingDeposits).values({
        id: `pd_${transactionId}`,
        userId: existingUser.id,
        amount: parseFloat(amount),
        cryptoType: selectedCrypto,
        proofImageUrl: imageData.url,
        transactionId: transactionId,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
  
      // Create transaction history record
      const transaction = await db.insert(transactionHistory).values({
        id: transactionId,
        userId: existingUser.id,
        type: TransactionTypeEnum.Deposit,
        amount: parseFloat(amount),
        description: `Pending deposit via ${selectedCrypto}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
  
      // Send email notification
      if (process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "deposits@coinspectrum.net",
            to: process.env.ADMIN_EMAIL || "admin@coinspectrum.net",
            subject: "New Deposit Pending Confirmation",
            react: DepositEmail({
              userFirstName: existingUser.firstName || userName,
              amount: amount,
              type: selectedCrypto,
              status: "pending",
              transactionDate: new Date().toISOString(),
              depositId: transactionId,
              isAdminCopy: true
            }),
          });
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
        }
      }
  
      return NextResponse.json({ 
        success: true, 
        message: "Deposit submitted successfully",
        pendingDeposit: pendingDeposit[0],
        transaction: transaction[0]
      });
  
    } catch (err: unknown) {
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
  
      if (err instanceof Error) {
        return NextResponse.json(
          { 
            error: "Failed to process deposit",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
          },
          { status: 500 }
        );
      }
  
      console.error("Unknown error:", err);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
  