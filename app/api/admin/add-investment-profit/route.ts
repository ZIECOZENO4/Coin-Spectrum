import { db } from "@/lib/db";
import {
  userInvestments,
  users,
  investmentProfitPayouts,
  transactionHistory,
  TransactionTypeEnum
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { InvestmentProfitUserEmail } from "@/emails/InvestmentProfitUserEmail"; // New email component for user
import { InvestmentProfitAdminEmail } from "@/emails/InvestmentProfitAdminEmail"; // New email component for admin

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // const { userId: adminUserId, orgId, has } = auth(); // Assuming this is the admin's ID

    // // Basic authorization check (ensure this is robust for your admin roles)
    // if (!adminUserId || !has || !has({ permission: "org:settings:manage" })) { // Example permission
    //     return new Response("Unauthorized: Admin access required", { status: 403 });
    // }

    const { userInvestmentId, amount } = await req.json();

    if (!userInvestmentId) {
      return new Response("Missing userInvestmentId", { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) { // Validate amount
      return new Response("Invalid or missing profit amount", { status: 400 });
    }

    // Fetch the user investment details
    const userInvestment = await db.query.userInvestments.findFirst({
      where: eq(userInvestments.id, userInvestmentId),
      with: {
        investment: true,
        user: true,
      },
    });

    if (!userInvestment || !userInvestment.user || !userInvestment.investment) {
      return new Response("User investment, user, or investment details not found", { status: 404 });
    }

    const userToNotify = userInvestment.user;
    const investmentDetails = userInvestment.investment;
    const profitAmount = amount;

    // Use a transaction to ensure all operations are successful
    await db.transaction(async (tx) => {
      // Update the user's balance
      await tx
        .update(users)
        .set({
          balance: sql`${users.balance} + ${profitAmount}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userToNotify.id));

      // Record the profit payout
      await tx.insert(investmentProfitPayouts).values({
        id: crypto.randomUUID(),
        userId: userToNotify.id,
        userInvestmentId: userInvestmentId,
        amount: profitAmount,
        payoutDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add a transaction history entry for the profit payout
      await tx.insert(transactionHistory).values({
        id: crypto.randomUUID(),
        userId: userToNotify.id,
        investmentId: investmentDetails.id,
        type: TransactionTypeEnum.InvestmentProfit,
        amount: profitAmount,
        description: `Profit payout for ${investmentDetails.name} investment (ID: ${userInvestmentId})`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Send emails after successful transaction
    const userEmail = userToNotify.email;
    const userFirstName = userToNotify.firstName || "Valued Investor";
    const adminEmail = process.env.ADMIN_EMAIL; // Ensure ADMIN_EMAIL is set in your .env
    const fromEmail = process.env.RESEND_FROM_EMAIL; // Ensure RESEND_FROM_EMAIL is set

    if (!fromEmail) {
        console.error("RESEND_FROM_EMAIL is not set. Skipping email notifications.");
    } else {
        // Send email to user
        if (userEmail) {
            try {
                await resend.emails.send({
                    from: fromEmail,
                    to: userEmail,
                    subject: "Investment Profit Added to Your Account!",
                    react: InvestmentProfitUserEmail({
                        userFirstName: userFirstName,
                        profitAmount: profitAmount.toFixed(2),
                        investmentName: investmentDetails.name,
                        companyName: "Coin Spectrum",
                        companyLogoUrl: process.env.COMPANY_LOGO_URL || "cs.png", // Replace with actual logo URL
                        copyrightText: `© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || "Coin Spectrum"}. All rights reserved.`,
                        contactNumber: process.env.CONTACT_NUMBER || "Support@coinspectrum.net",
                    }),
                });
            } catch (emailError) {
                console.error(`Failed to send profit notification email to user ${userEmail}:`, emailError);
            }
        } else {
            console.warn(`User email not found for user ID: ${userToNotify.id}. Skipping user email notification.`);
        }

        // Send email to admin
        if (adminEmail) {
            try {
                await resend.emails.send({
                    from: fromEmail,
                    to: adminEmail,
                    subject: `Investment Profit Payout Processed for ${userFirstName}`,
                    react: InvestmentProfitAdminEmail({
                        adminName: "Admin", // Or fetch admin's name if available
                        userName: userFirstName,
                        userEmail: userEmail || "N/A",
                        profitAmount: profitAmount.toFixed(2),
                        investmentName: investmentDetails.name,
                        userInvestmentId: userInvestmentId,
                        companyName: process.env.COMPANY_NAME || "Coin Spectrum",
                        companyLogoUrl: process.env.COMPANY_LOGO_URL || "cs.png",
                    }),
                });
            } catch (emailError) {
                console.error(`Failed to send profit notification email to admin ${adminEmail}:`, emailError);
            }
        } else {
            console.warn("ADMIN_EMAIL is not set in .env. Skipping admin email notification.");
        }
    }

    return Response.json({ success: true, message: "Profit added to user balance and notifications sent." });

  } catch (error) {
    console.error("Error adding investment profit:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    // Avoid exposing detailed internal errors in production for non-Response objects
    if (error instanceof Response) {
        return error;
    }
    return new Response("Internal Server Error", {
      status: 500,
      statusText: process.env.NODE_ENV === "development" ? errorMessage : "An internal error occurred.",
    });
  }
}
