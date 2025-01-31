import { createUser } from "@/app/sync-user/create-user";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
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
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });
    console.log(`User fetched from database: ${user}}`);

    if (user) {
      console.log("User found, redirecting to user-dashboard");
      return NextResponse.json(user, { status: 200 });
    }

    console.log("Creating user through webhook");
    const fromSyncingUser = await createUser(ref);
    
    // Send welcome email to new user
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: fromSyncingUser.email,
        subject: 'Welcome to Coin Spectrum!',
        react: WelcomeEmail({
          userFirstName: fromSyncingUser.firstName || fromSyncingUser.username || 'User',
          userEmail: fromSyncingUser.email
        })
      });
      
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Delete the created user if email fails
      await db.delete(users).where(eq(users.id, fromSyncingUser.id));
      throw new Error("Failed to send welcome email. User creation rolled back.");
    }

    console.log(`User created: ${JSON.stringify(fromSyncingUser)}`);
    return NextResponse.json(fromSyncingUser, { status: 200 });
  } catch (error: unknown) {
    console.log("An error occurred", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`Error message: ${errorMessage}`);

    return NextResponse.json(
      {
        error: "An unknown error occurred while updating the token price: " + errorMessage,
      },
      { status: 500 }
    );
  }
}
