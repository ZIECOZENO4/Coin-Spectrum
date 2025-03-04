// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher([
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/",
//   "/trade",
//   "/features",
// "/invest",
// "/about",
//   "/sync-user",
//   "/api/uploadthing",
// ]);

// export default clerkMiddleware(
//   (auth, request) => {
//     if (!isPublicRoute(request)) {
//       auth().protect();
//     }
//   }
//   // { debug: true }
// );

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };


import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

// Define public routes using Clerk's route matcher
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/trade",
  "/features",
  "/invest",
  "/about",
  "/sync-user",
  "/api/uploadthing",
]);

export default clerkMiddleware((auth, request: NextRequest) => {
  // Handle authenticated users
  if (auth().userId) {
    // Redirect authenticated users away from public routes
    if (isPublicRoute(request)) {
      let redirectPath = "/sync-user";
      
      // Special case for sync-user route
      if (request.nextUrl.pathname === "/sync-user") {
        return NextResponse.next();
      }

      // Redirect from auth pages to dashboard
      if (request.nextUrl.pathname.startsWith("/sign-")) {
        redirectPath = "/sync-user";
      }

      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    
    // Allow access to protected routes
    return NextResponse.next();
  }

  // Handle unauthenticated users
  if (!isPublicRoute(request)) {
    return auth().redirectToSignIn({ returnBackUrl: request.url });
  }

  // Allow public routes
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
