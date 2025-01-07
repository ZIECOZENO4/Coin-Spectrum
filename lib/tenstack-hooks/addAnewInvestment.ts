// import { CreateInvestmentData } from "@/app/api/(user)/addAnInvestment/route";
// import { Investment } from "@prisma/client";
// import {
//   useMutation,
//   MutationFunction,
//   MutationKey,
// } from "@tanstack/react-query";
// import { toast } from "sonner";


// const createInvestment: MutationFunction<
//   Investment,
//   CreateInvestmentData
// > = async (data) => {
//   console.log("Sending data to API:", data);

//   const response = await fetch("/api/addAnInvestment", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const errorResponse = await response.json();
//     throw new Error(errorResponse.error || "Error creating investment");
//   }

//   const responseData = await response.json();
//   console.log("Response from API:", responseData);

//   return responseData;
// };

// export const useCreateInvestment = () => {
//   const mutationKey: MutationKey = ["createInvestment"];

//   return useMutation({
//     mutationFn: createInvestment,
//     mutationKey,
//     onMutate: () => {
//       console.log("Mutation started");
//     },
//     onSuccess: (data) => {
//       console.log("Mutation succeeded:", data);
//       toast.success("Investment created successfully!");
//     },
//     onError: (error: any) => {
//       console.error("Mutation failed:", error);
//       toast.error(`Error: ${error.message}`);
//     },
//   });
// };


import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { createUserTracker } from "../../app/_action/prisma-core-functionns";

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
      userName: user.userName,
      firstName: user.firstName,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      role: "user",
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        userName: user.userName,
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
      await db.update(users)
        .set({ referredById: ref })
        .where(eq(users.id, AuthenticatedUser[0].id));
    }
  } catch (error) {
    console.error("Error handling referral:", error);
  }

  console.log("Creating user tracker");
  await createUserTracker(session.user.id);

  console.log("Returning authenticated user:", AuthenticatedUser[0]);
  return AuthenticatedUser[0];
}
