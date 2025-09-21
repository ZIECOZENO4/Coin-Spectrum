import { db } from "@/lib/db";
import { users, investmentProfitPayouts } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { InvestmentProfitUserEmail } from "@/emails/InvestmentProfitUserEmail";
import { InvestmentProfitAdminEmail } from "@/emails/InvestmentProfitAdminEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const profitAmount = Number(body?.amount);

    if (!Number.isFinite(profitAmount) || profitAmount <= 0) {
      return new Response("Invalid or missing profit amount", { status: 400 });
    }

    const clerkUser = await currentUser();
    const userEmail =
      clerkUser?.emailAddresses?.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      null;
    const userFirstName = clerkUser?.firstName || "Valued Investor";

    if (!userEmail) {
      return new Response("User email not available", { status: 400 });
    }

    // Load your app user by email (or swap to users.clerkId if that’s your mapping)
    const [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, userEmail));

    if (!dbUser?.id) {
      return new Response("User not found", { status: 404 });
    }

    // Perform balance update and payout record atomically
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          balance: sql`${users.balance} + ${profitAmount}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, dbUser.id));

      await tx.insert(investmentProfitPayouts).values({
        id: crypto.randomUUID(),
        userId: dbUser.id,
        userInvestmentId: "000",
        amount: profitAmount,
        payoutDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Send emails after a successful commit
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!fromEmail) {
      console.error("RESEND_FROM_EMAIL is not set. Skipping email notifications.");
    } else {
      if (userEmail) {
        try {
          await resend.emails.send({
            from: fromEmail,
            to: userEmail,
            subject: "Investment Profit Added to Your Account!",
            react: InvestmentProfitUserEmail({
              userFirstName,
              profitAmount: profitAmount.toFixed(2),
              investmentName: "Coin Spectrum",
              companyName: process.env.COMPANY_NAME || "Coin Spectrum",
              companyLogoUrl: process.env.COMPANY_LOGO_URL || "cs.png",
              copyrightText: `© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || "Coin Spectrum"}. All rights reserved.`,
              contactNumber: process.env.CONTACT_NUMBER || "Support@coinspectrum.net",
            }),
          });
        } catch (emailError) {
          console.error(`Failed to send profit notification email to user ${userEmail}:`, emailError);
        }
      }

      if (adminEmail) {
        try {
          await resend.emails.send({
            from: fromEmail,
            to: adminEmail,
            subject: `Investment Profit Payout Processed for ${userFirstName}`,
            react: InvestmentProfitAdminEmail({
              adminName: "Admin",
              userName: userFirstName,
              userEmail: userEmail || "N/A",
              profitAmount: profitAmount.toFixed(2),
              investmentName: "Coin Spectrum",
              userInvestmentId: "000",
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

    return new Response(
      JSON.stringify({ success: true, message: "Profit added to user balance and notifications sent." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding investment profit:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        message: process.env.NODE_ENV === "development" ? errorMessage : "An internal error occurred.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}