 
// import { redirect } from "next/navigation";
// import { db } from "@/lib/db";
// import { users } from "@/lib/db/schema";
// import { getUserAuth } from "@/lib/auth/utils";
// import { eq } from "drizzle-orm";
// import { createUserTracker } from "../../app/_action/prisma-core-functionns";

// export async function createUser(ref: string) {
//   console.log("THIS IS THE REF FOR NOW inside of the backend ", ref);
//   console.log("Entering createUser function");
//   const { session } = await getUserAuth();
//   console.log("Session obtained:", session);
//   if (!session) {
//     console.log("No session found, redirecting to login");
//     redirect("/sign-in");
//   }
//   const { user } = session;
//   console.log("User extracted from session:", user);
//   if (!user.email) {
//     console.log("Email not provided, throwing error");
//     throw new Error("email must be provided");
//   }

//   console.log("Checking if user already exists");
//   const existingUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

//   if (existingUser.length > 0) {
//     console.log("User already exists, returning existing user");
//     return existingUser[0];
//   }

//   console.log("Creating new authenticated user");
//   console.log("Upserting authenticated user");
//   const AuthenticatedUser = await db.insert(users)
//     .values({
//       id: user.id,
//       userName: user.userName,
//       firstName: user.firstName,
//       fullName: user.fullName,
//       email: user.email,
//       imageUrl: user.imageUrl,
//       role: "user",
//     })
//     .onConflictDoUpdate({
//       target: users.id,
//       set: {
//         userName: user.userName,
//         firstName: user.firstName,
//         fullName: user.fullName,
//         email: user.email,
//         imageUrl: user.imageUrl,
//         role: "user",
//       },
//     })
//     .returning();

//   console.log("this is the authenticateduser", AuthenticatedUser[0]);
//   console.log("Checking referral information");
//   try {
//     if (ref && ref !== "noRef") {
//       console.log("Updating user's referral information");
//       await db.update(users)
//         .set({ referredById: ref })
//         .where(eq(users.id, AuthenticatedUser[0].id));
//     }
//   } catch (error) {
//     console.error("Error handling referral:", error);
//   }

//   console.log("Creating user tracker");
//   await createUserTracker(session.user.id);

//   console.log("Returning authenticated user:", AuthenticatedUser[0]);
//   return AuthenticatedUser[0];
// }

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, userReferrals } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { createUserTracker } from "../../app/_action/prisma-core-functionns";
import { Resend } from 'resend';
import { ReferralEmail } from "@/emails/ReferralEmail";
import { WelcomeReferralEmail } from "@/emails/WelcomeReferralEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createUser(ref: string) {
  console.log("THIS IS THE REF FOR NOW inside of the backend ", ref);
  console.log("Entering createUser function");
  const { session } = await getUserAuth();
  console.log("Session obtained:", session);
  if (!session) {
    console.log("No session found, redirecting to login");
    redirect("/sign-in");
  }
  const { user } = session;
  console.log("User extracted from session:", user);
  if (!user.email) {
    console.log("Email not provided, throwing error");
    throw new Error("email must be provided");
  }

  console.log("Checking if user already exists");
  const existingUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  if (existingUser.length > 0) {
    console.log("User already exists, returning existing user");
    return existingUser[0];
  }

  console.log("Creating new authenticated user");
  console.log("Upserting authenticated user");
  const AuthenticatedUser = await db.insert(users)
    .values({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      role: "user",
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        username: user.username,
        firstName: user.firstName,
        fullName: user.fullName,
        email: user.email,
        imageUrl: user.imageUrl,
        role: "user",
      },
    })
    .returning();

  console.log("this is the authenticateduser", AuthenticatedUser[0]);
  console.log("Checking referral information");
  try {
    if (ref && ref !== "noRef") {
      console.log("Updating user's referral information");
      // Get referrer's details
      const referrer = await db
        .select()
        .from(users)
        .where(eq(users.id, ref))
        .limit(1);

      if (referrer.length > 0) {
        // Create referral record
        await db.insert(userReferrals)
          .values({
            id: `ref_${Date.now()}`,
            referrerId: ref,
            referredUserId: AuthenticatedUser[0].id,
          });

        // Send email to referrer
   
await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: referrer[0].email,
  subject: "New Referral Signup!",
  react: ReferralEmail({
    referrerName: referrer[0].fullName ?? referrer[0].username ?? "User",
    newUserName: AuthenticatedUser[0].fullName ?? AuthenticatedUser[0].username ?? "New User",
    date: new Date().toISOString(),
  }),
});

        // Send welcome email to new user
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: AuthenticatedUser[0].email,
          subject: "Welcome to Coin Spectrum!",
          react: WelcomeReferralEmail({
            userName: AuthenticatedUser[0].fullName ?? AuthenticatedUser[0].username ?? "User",
            referrerName: referrer[0].fullName ?? referrer[0].username ?? "Referrer",
            date: new Date().toISOString(),
          }),
        });
        
      }
    }
  } catch (error) {
    console.error("Error handling referral:", error);
  }

  console.log("Creating user tracker");
  await createUserTracker(session.user.id);

  console.log("Returning authenticated user:", AuthenticatedUser[0]);
  return AuthenticatedUser[0];
}
