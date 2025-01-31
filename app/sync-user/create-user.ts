import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, userReferrals } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { createUserTracker } from "../../app/_action/prisma-core-functionns";
import { Resend } from 'resend';
import { ReferralEmail } from "@/emails/ReferralEmail";
import { WelcomeReferralEmail } from "@/emails/WelcomeReferralEmail";
import { WelcomeEmail } from "@/emails/WelcomeEmail";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function createUser(ref: string) {
  console.log("Starting createUser with referral:", ref);
  const { session } = await getUserAuth();
  if (!session?.user?.email) {
    console.log("No session or email found, redirecting to sign-in");
    redirect("/sign-in");
  }

  console.log("Checking for existing user:", session.user.id);
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (existingUser.length > 0) {
    console.log("Existing user found, returning");
    return existingUser[0];
  }

  console.log("Creating new user");
  const newUser = await db.insert(users)
    .values({
      id: session.user.id,
      username: session.user.username,
      firstName: session.user.firstName,
      fullName: session.user.fullName,
      email: session.user.email,
      imageUrl: session.user.imageUrl,
      role: "user",
    })
    .returning();
  
  console.log("New user created:", newUser[0].id);

  // Immediately send welcome and admin emails
  try {
    await Promise.all([
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: newUser[0].email,
        subject: 'Welcome to Coin Spectrum!',
        react: WelcomeEmail({
          userFirstName: newUser[0].firstName || newUser[0].username || 'User',
          userEmail: newUser[0].email
        })
      }),
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: process.env.ADMIN_EMAIL!,
        subject: 'New User Registration on Coin Spectrum',
        html: `
          <h1>New User Registration</h1>
          <p>A new user has registered:</p>
          <ul>
            <li>Name: ${newUser[0].fullName || newUser[0].username}</li>
            <li>Email: ${newUser[0].email}</li>
            <li>Registration Time: ${new Date().toLocaleString()}</li>
          </ul>
        `
      })
    ]);
    console.log("Welcome and admin notification emails sent successfully");
  } catch (error) {
    console.error('Error sending welcome emails:', error);
  }

  // Handle referral if exists
  if (ref && ref !== "noRef") {
    console.log("Processing referral for:", ref);
    const referrer = await db
      .select()
      .from(users)
      .where(eq(users.id, ref))
      .limit(1);

    if (referrer.length > 0) {
      console.log("Referrer found:", referrer[0].id);
      
      try {
        const referralRecord = await db.insert(userReferrals)
          .values({
            id: `ref_${Date.now()}`,
            referrerId: ref,
            referredUserId: newUser[0].id,
          })
          .returning();
        console.log("Referral record created:", referralRecord[0].id);

        console.log("Sending referral emails");
        await Promise.all([
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: referrer[0].email,
            subject: "New Referral Signup!",
            react: ReferralEmail({
              referrerName: referrer[0].fullName ?? referrer[0].username ?? "User",
              newUserName: newUser[0].fullName ?? newUser[0].username ?? "New User",
              date: new Date().toISOString(),
            }),
          }),
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: newUser[0].email,
            subject: "Welcome to Coin Spectrum!",
            react: WelcomeReferralEmail({
              userName: newUser[0].fullName ?? newUser[0].username ?? "User",
              referrerName: referrer[0].fullName ?? referrer[0].username ?? "Referrer",
              date: new Date().toISOString(),
            }),
          })
        ]);
        console.log("Referral emails sent successfully");
      } catch (error) {
        console.error("Error processing referral:", error);
      }
    } else {
      console.log("Referrer not found for ID:", ref);
    }
  } else {
    console.log("No referral to process");
  }

  console.log("Creating user tracker");
  await createUserTracker(session.user.id);
  console.log("User creation process completed");
  return newUser[0];
}

