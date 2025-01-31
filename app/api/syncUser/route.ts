// import { createUser } from "@/app/sync-user/create-user";
// import { getUserAuth } from "@/lib/auth/utils";
// import { db } from "@/lib/db";
// import { users } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";

// import { NextRequest, NextResponse } from "next/server";

// export async function POST(
//   request: NextRequest,
//   res: NextResponse
// ): Promise<NextResponse> {
//   console.log("POST function started");
//   const { session } = await getUserAuth();
//   const { searchParams } = new URL(request.url);
//   const ref = searchParams.get("ref");
//   if (!ref) {
//     return NextResponse.json({ error: "No Ref Found" }, { status: 404 });
//   }
//   console.log(`Ref: ${ref}`);

//   try {
//     console.log("Attempting to authenticate user");
//     console.log(`Authenticated user ID: ${session}`);
//     if (!session) {
//       console.log("No user ID found, redirecting to sign-in");
//       throw new Error("No user ID found, redirecting to sign-in page.");
//     }
//     console.log("Fetching user from database");
//     const user = await db.query.users.findFirst({
//       where: eq(users.id, session.user.id),
//     });
//     console.log(`User fetched from database: ${user}}`);
//     if (user) {
//       console.log("User found, redirecting to user-dashboard");
//       return NextResponse.json(user, { status: 200 });
//     }
//     console.log("Creating user through webhook");
//     const fromSyncingUser = await createUser(ref);
//     console.log(`User created: ${JSON.stringify(fromSyncingUser)}`);
//     console.log("Returning response with status 200");

//     return NextResponse.json(fromSyncingUser, { status: 200 });
//   } catch (error: unknown) {
//     console.log("An error occurred", error);
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     console.log(`Error message: ${errorMessage}`);

//     console.log("Returning error response with status 500");
//     return NextResponse.json(
//       {
//         error:
//           "An unknown error occurred while updating the token price: " +
//           errorMessage,
//       },
//       { status: 500 }
//     );
//   }
// }


// app/sync-user/create-user.ts
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, userReferrals } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { Resend } from 'resend';
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { createUserTracker } from "@/app/_action/prisma-core-functionns";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createUser(ref: string) {
  const { session } = await getUserAuth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  // Check for existing user
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  // Create new user
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

  try {
    // Send welcome email to new user
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: newUser[0].email,
      subject: 'Welcome to Coin Spectrum!',
      react: WelcomeEmail({
        userFirstName: newUser[0].firstName || newUser[0].username || 'User',
        userEmail: newUser[0].email
      })
    });

    // Send notification to admin
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: 'coinspectrum1@gmail.com'!,
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
    });

    console.log('Welcome and admin notification emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
    // Don't throw error to prevent user creation from failing
  }

  // Handle referral if exists
  if (ref && ref !== "noRef") {
    const referrer = await db
      .select()
      .from(users)
      .where(eq(users.id, ref))
      .limit(1);

    if (referrer.length > 0) {
      await db.insert(userReferrals)
        .values({
          id: `ref_${Date.now()}`,
          referrerId: ref,
          referredUserId: newUser[0].id,
        });
    }
  }

  await createUserTracker(session.user.id);
  return newUser[0];
}
