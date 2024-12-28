import { createUser } from "@/app/sync-user/create-user";
import { getUserAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";

import { NextRequest, NextResponse } from "next/server";
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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    console.log(`User fetched from database: ${user}}`);
    if (user) {
      console.log("User found, redirecting to user-dashboard");
      return NextResponse.json(user, { status: 200 });
    }
    console.log("Creating user through webhook");
    const fromSyncingUser = await createUser(ref);
    console.log(`User created: ${JSON.stringify(fromSyncingUser)}`);
    console.log("Returning response with status 200");

    return NextResponse.json(fromSyncingUser, { status: 200 });
  } catch (error: unknown) {
    console.log("An error occurred", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`Error message: ${errorMessage}`);

    console.log("Returning error response with status 500");
    return NextResponse.json(
      {
        error:
          "An unknown error occurred while updating the token price: " +
          errorMessage,
      },
      { status: 500 }
    );
  }
}

// import { createUser } from "@/app/sync-user/create-user";
// import { getUserAuth } from "@/lib/auth/utils";
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db";

// export async function POST(request: NextRequest): Promise<NextResponse> {
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
//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
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

// export async function OPTIONS(request: NextRequest) {
//   const origin = request.headers.get("origin");

//   if (origin !== "https://www.waxbit-investment.com") {
//     return new NextResponse(null, {
//       status: 403,
//       statusText: "Forbidden",
//     });
//   }

//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": origin,
//       "Access-Control-Allow-Methods": "POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type",
//     },
//   });
// }

// import { createUser } from "@/app/sync-user/create-user";
// import { getUserAuth } from "@/lib/auth/utils";
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db";

// // Config
// // ========================================================
// const allowedMethods = "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS";
// const allowedOrigin = "*";
// const allowedHeaders = "Content-Type, Authorization";
// const exposedHeaders = "";
// const maxAge = "86400"; // 60 * 60 * 24 = 24 hours
// const credentials = "true";
// const domainUrl = "https://waxbit-investment.com";

// const getCorsHeaders = (origin: string) => {
//   // Default options
//   console.log("this is the origin to be logged", origin);
//   const headers = {
//     "Access-Control-Allow-Methods": allowedMethods,
//     "Access-Control-Allow-Headers": allowedHeaders,
//     "Access-Control-Allow-Origin": domainUrl,
//   };

//   // Return result
//   return headers;
// };

// // Endpoints
// // ========================================================
// export async function POST(
//   request: NextRequest,
//   res: NextResponse
// ): Promise<NextResponse> {
//   console.log("POST function started");
//   const { session } = await getUserAuth();
//   const { searchParams } = new URL(request.url);
//   const ref = searchParams.get("ref");
//   if (!ref) {
//     return NextResponse.json(
//       { error: "No Ref Found" },
//       {
//         status: 404,
//         headers: getCorsHeaders(request.headers.get("origin") || ""),
//       }
//     );
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
//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//     });
//     console.log(`User fetched from database: ${user}}`);
//     if (user) {
//       console.log("User found, redirecting to user-dashboard");
//       return NextResponse.json(user, {
//         status: 200,
//         headers: getCorsHeaders(request.headers.get("origin") || ""),
//       });
//     }
//     console.log("Creating user through webhook");
//     const fromSyncingUser = await createUser(ref);
//     console.log(`User created: ${JSON.stringify(fromSyncingUser)}`);
//     console.log("Returning response with status 200");

//     return NextResponse.json(fromSyncingUser, {
//       status: 200,
//       headers: getCorsHeaders(request.headers.get("origin") || ""),
//     });
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
//       {
//         status: 500,
//         headers: getCorsHeaders(request.headers.get("origin") || ""),
//       }
//     );
//   }
// }
