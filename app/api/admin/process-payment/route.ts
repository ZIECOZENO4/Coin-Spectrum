import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, transactionHistory, investmentProfitPayouts, userInvestments, investments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Resend } from "resend";
import { InvestmentProfitUserEmail } from "@/emails/InvestmentProfitUserEmail";
import { InvestmentProfitAdminEmail } from "@/emails/InvestmentProfitAdminEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, paymentType, description} = body;

    // Validate input
    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid userId or amount" },
        { status: 400 }
      );
    }

    // Get the user details including current balance
    const user = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        balance: users.balance,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userData = user[0];

    // Update user balance by adding the payout amount
    await db
      .update(users)
      .set({ 
        balance: userData.balance + amount,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Add transaction history record
    await db.insert(transactionHistory).values({
      id: crypto.randomUUID(),
      userId: userId,
      type: paymentType === "profit" ? "investment_profit" : "investment", // Use proper transaction type
      amount: amount,
      description: description || `${paymentType === "profit" ? "Profit" : "Bonus"} payment of $${amount}`,
    });

    // For profit payments, always record in investment profit payouts for totalProfits calculation
    if (paymentType === "profit") {
      try {
        let userInvestmentId = body.userInvestmentId;
        
        // If no specific userInvestmentId provided, create or find a general profit tracking investment
        if (!userInvestmentId) {
          // Check if user already has a general profit tracking investment
          const existingGeneralInvestment = await db
            .select({ id: userInvestments.id })
            .from(userInvestments)
            .where(
              and(
                eq(userInvestments.userId, userId),
                eq(userInvestments.investmentId, "general-profit-tracking")
              )
            )
            .limit(1);

          if (existingGeneralInvestment.length > 0) {
            userInvestmentId = existingGeneralInvestment[0].id;
          } else {
            // Create a general investment record for profit tracking
            const generalInvestmentId = "general-profit-tracking";
            
            // First, ensure the general investment exists in investments table
            await db.insert(investments).values({
              id: generalInvestmentId,
              name: "General Profit Tracking",
              price: 0,
              profitPercent: 0,
              rating: 0,
              principalReturn: true,
              principalWithdraw: true,
              creditAmount: 0,
              depositFee: "0",
              debitAmount: 0,
              durationDays: 0,
              createdAt: new Date(),
              updatedAt: new Date()
            }).onConflictDoNothing();

            // Create user investment record for profit tracking
            const [newUserInvestment] = await db.insert(userInvestments).values({
              id: crypto.randomUUID(),
              userId: userId,
              investmentId: generalInvestmentId,
              amount: 0,
              createdAt: new Date(),
              updatedAt: new Date()
            }).returning();

            userInvestmentId = newUserInvestment.id;
          }
        }

        // Insert into investment profit payouts
        await db.insert(investmentProfitPayouts).values({
          id: crypto.randomUUID(),
          userId: userId,
          userInvestmentId: userInvestmentId,
          amount: amount,
          payoutDate: new Date(),
        });
      } catch (investmentError) {
        console.warn("Could not insert into investment_profit_payouts:", investmentError);
        // Continue with the payment processing even if this fails
      }
    }

    // Send email notifications
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Support@coinspectrum.net";
        const adminEmail = process.env.ADMIN_EMAIL || "Support@coinspectrum.net";
        const userFirstName = userData.fullName?.split(' ')[0] || "User";
        const companyName = process.env.COMPANY_NAME || "Coin Spectrum";
        const companyLogoUrl = process.env.COMPANY_LOGO_URL || "cs.png";
        const contactNumber = process.env.CONTACT_NUMBER || "Support@coinspectrum.net";
        const copyrightText = `© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || "Coin Spectrum"}. All rights reserved.`;

        // Send email to user
        if (userData.email) {
          await resend.emails.send({
            from: fromEmail,
            to: userData.email,
            subject: `${paymentType === "profit" ? "Investment Profit" : "Bonus Payment"} Added to Your Account!`,
            react: InvestmentProfitUserEmail({
              userFirstName: userFirstName,
              profitAmount: amount.toFixed(2),
              investmentName: paymentType === "profit" ? "Investment Profit" : "Bonus Payment",
              companyName: companyName,
              companyLogoUrl: companyLogoUrl,
              copyrightText: copyrightText,
              contactNumber: contactNumber,
            }),
          });
        }

        // Send email to admin
        if (adminEmail) {
          await resend.emails.send({
            from: fromEmail,
            to: adminEmail,
            subject: `${paymentType === "profit" ? "Investment Profit" : "Bonus Payment"} Processed - ${userData.email}`,
            react: InvestmentProfitAdminEmail({
              adminName: "Admin",
              userName: userData.fullName || userData.email,
              userEmail: userData.email,
              profitAmount: amount.toFixed(2),
              investmentName: paymentType === "profit" ? "Investment Profit" : "Bonus Payment",
              userInvestmentId: body.userInvestmentId || "Investment Payment",
              companyName: companyName,
              companyLogoUrl: companyLogoUrl,
            }),
          });
        }
      } catch (emailError) {
        console.error("Email dispatch error:", emailError);
        // Don't fail the entire operation if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed $${amount} ${paymentType === "profit" ? "profit" : "bonus"} payment for ${userData.fullName || userData.email}. New balance: $${(userData.balance + amount).toFixed(2)}`,
      data: {
        userId,
        amount,
        paymentType,
        userName: userData.fullName || userData.email,
        userEmail: userData.email,
        previousBalance: userData.balance,
        newBalance: userData.balance + amount,
      }
    });

  } catch (error) {
    console.error("Error processing payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const revalidate = 0;
