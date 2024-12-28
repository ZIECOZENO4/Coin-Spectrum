// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// export type AuthSession = {
//   session: {
//     user: {
//       id: string;
//       name?: string;
//       email?: string;
//     };
//   } | null;
// };

// export const getUserAuth = async () => {
//   // find out more about setting up 'sessionClaims' (custom sessions) here: https://clerk.com/docs/backend-requests/making/custom-session-token
//   const { userId, sessionClaims } = auth();
//   if (userId) {
//     return {
//       session: {
//         user: {
//           id: userId,
//           name: `${sessionClaims?.firstName} ${sessionClaims?.lastName}`,
//           email: sessionClaims?.email,
//         },
//       },
//     } as AuthSession;
//   } else {
//     return { session: null };
//   }
// };

// export const checkAuth = async () => {
//   const { userId } = auth();
//   if (!userId) redirect("/sign-in");
// };

import { redirect } from "next/navigation";
import { prisma } from "../db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { EmailAddress, auth } from "@clerk/nextjs/server";
import { User } from "@clerk/nextjs/server";

// type AuthSession = {
//   session: {
//     user: {
//       id: string;
//       name?: string;
//       email?: string;
//     };
//   } | null;
// };

// export const getUserAuth = async () => {
//   const { userId } = auth();
//   if (userId) {
//     return {
//       session: {
//         user: {
//           id: userId,
//         },
//       },
//     } as AuthSession;
//   } else {
//     return { session: null };
//   }
// };
export const getUserId = () => {
  try {
    const { userId } = auth();
    return userId;
  } catch (error) {
    console.error("Error getting userId:", error);
    return null;
  }
};

export const checkAuth = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
};

export const getUserAuthInfo = async () => {
  const user = await currentUser();
  if (user) {
    return user;
  }
  throw new Error("No User Logged In");
};

export type AuthSession = {
  session: {
    user: {
      id: string;
      userName: string | null;
      firstName?: string;
      fullName?: string;
      imageUrl?: string;
      email: string | undefined;
      image: string | null;
    };
  } | null;
};

function getPrimaryEmail(
  emails: EmailAddress[],
  primaryId: string | null
): string | undefined {
  const primaryEmail = emails.find((email) => email.id === primaryId);
  if (!primaryEmail) {
    console.log("there is no primary email here ");
    return emails[0].emailAddress;
  }
  return primaryEmail.emailAddress;
}
export const getUserAuth = async (): Promise<AuthSession> => {
  // const { userId } = auth();
  const session = await currentUser();
  // console.log("thsi is the sesion that would be manually added to the database ", session);

  if (session) {
    return {
      session: {
        user: {
          id: session.id,
          userName: session.username,
          email: getPrimaryEmail(
            session.emailAddresses,
            session.primaryEmailAddressId
          ),
          firstName: "",
          fullName: `${session.firstName} ${session.lastName}`,
          image: session.imageUrl,
        },
      },
    };
  } else {
    return { session: null };
  }
};

async function checkUserRoleAndRedirect(userId: string) {
  // Fetch the user's role using Prisma
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true, // Only select the role field
    },
  });

  if (!user || user.role !== "admin") {
    // If the user is not found or not an admin, redirect to the blocked page
    return redirect("/blocked?reason=not_admin");
  }

  // If the user is an admin, no redirection is needed
  // Depending on where you use this function, you might return null or another appropriate value
  return null;
}

export default checkUserRoleAndRedirect;
