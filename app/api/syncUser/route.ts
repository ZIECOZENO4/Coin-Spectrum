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

import { createUser } from "@/app/sync-user/create-user";
import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { users, userReferrals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from 'resend';
import { NextRequest, NextResponse } from "next/server";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  res: NextResponse
): Promise<NextResponse> {
  console.log("POST function started");
  const { session } = await getUserAuth();
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  
  if (!ref) {
    return NextResponse.json({ error: "No Ref Found" }, { status: 404 });
  }
  console.log(`Ref: ${ref}`);

  try {
    console.log("Attempting to authenticate user");
    console.log(`Authenticated user ID: ${session}`);
    if (!session) {
      console.log("No user ID found, redirecting to sign-in");
      throw new Error("No user ID found, redirecting to sign-in page.");
    }

    console.log("Fetching user from database");
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });
    console.log(`User fetched from database: ${existingUser}`);

    if (existingUser) {
      console.log("User found, redirecting to user-dashboard");
      return NextResponse.json(existingUser, { status: 200 });
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

    // Send emails only for new users
    try {
      await Promise.all([
        // Send welcome email to user
        resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: newUser[0].email,
          subject: 'Welcome to Coin Spectrum!',
          react: WelcomeEmail({
            userFirstName: newUser[0].firstName || newUser[0].username || 'User',
            userEmail: newUser[0].email
          })
        }),
        // Send admin notification
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
      console.error('Error sending emails:', error);
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
        console.log("Referral relationship created");
      }
    }

    console.log(`User created: ${JSON.stringify(newUser[0])}`);
    return NextResponse.json(newUser[0], { status: 200 });

  } catch (error: unknown) {
    console.log("An error occurred", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`Error message: ${errorMessage}`);

    return NextResponse.json(
      {
        error: "An unknown error occurred: " + errorMessage,
      },
      { status: 500 }
    );
  }
}
