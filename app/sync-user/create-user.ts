import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getUserAuth } from "@/lib/auth/utils";
import { UserRole } from "@prisma/client";
import { createUserTracker } from "../_action/prisma-core-functionns";
// import { createUserTracker } from "../action/prisma-core-functions";

export async function createUser(ref: string) {
  console.log("THIS IS THE REF FOR NOW inside of the backend ", ref);
  console.log("Entering createUser function"); // Log entry point of the function
  const { session } = await getUserAuth();
  console.log("Session obtained:", session); // Log the session object
  if (!session) {
    console.log("No session found, redirecting to login"); // Log redirection to login
    redirect("/sign-in");
  }
  const { user } = session;
  console.log("User extracted from session:", user); // Log the user object
  if (!user.email) {
    console.log("Email not provided, throwing error"); // Log error for missing email
    throw new Error("email must be provided");
  }

  console.log("Checking if user already exists"); // Log checking for existing user
  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (existingUser) {
    console.log("User already exists, returning existing user"); // Log returning existing user
    return existingUser;
  }

  console.log("Creating new authenticated user"); // Log creating new user
  console.log("Upserting authenticated user"); // Log upserting user
  const AuthenticatedUser = await prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: {
      userName: user.userName,
      firstName: user.firstName,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      role: UserRole.user,
    },
    create: {
      id: user.id,
      userName: user.userName,
      firstName: user.firstName,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      role: UserRole.user,
    },
  });

  console.log("this isi the authenticateduser", AuthenticatedUser);
  console.log("Checking referral information"); // Log checking referral
  console.log("Checking referral information"); // Log checking referral
  try {
    if (ref && ref !== "noRef") {
      console.log("Updating user's referral information");
      await prisma.user.update({
        where: {
          id: AuthenticatedUser.id,
        },
        data: {
          referredById: ref,
        },
      });
    }
  } catch (error) {
    console.error("Error handling referral:", error);
  }

  console.log("Creating user tracker"); // Log creating user tracker
  await createUserTracker(session.user.id);

  console.log("Returning authenticated user:", AuthenticatedUser); // Log returning authenticated user
  return AuthenticatedUser;
}
