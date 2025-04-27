import { createUser } from "@/app/sync-user/create-user";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  res: NextResponse
): Promise<NextResponse> {
  const { session } = await getUserAuth();
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  
  if (!ref) {
    return NextResponse.json({ error: "No Ref Found" }, { status: 404 });
  }

  try {
    if (!session) {
      throw new Error("No user ID found, redirecting to sign-in page.");
    }
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (user) {
      return NextResponse.json(user, { status: 200 });
    }
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
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Delete the created user if email fails
      await db.delete(users).where(eq(users.id, fromSyncingUser.id));
      throw new Error("Failed to send welcome email. User creation rolled back.");
    }
    return NextResponse.json(fromSyncingUser, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: "An unknown error occurred while updating the token price: " + errorMessage,
      },
      { status: 500 }
    );
  }
}
