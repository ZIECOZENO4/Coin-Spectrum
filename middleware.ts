import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/trade",
  "/features",
"/invest",
"/about",
  "/sync-user",
  "/api/uploadthing",
  "/api/user/ban-status",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/(admin)(.*)",
]);

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      auth().protect();
    }

    // Check ban status for authenticated users (except admin routes)
    if (auth().userId && !isAdminRoute(request)) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/user/ban-status`, {
          headers: {
            'Authorization': request.headers.get('authorization') || '',
            'Cookie': request.headers.get('cookie') || '',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.banned) {
            // Redirect banned users to banned page
            return NextResponse.redirect(new URL('/banned', request.url));
          }
        }
      } catch (error) {
        console.error("Error checking ban status in middleware:", error);
        // Continue with request if ban check fails
      }
    }
  }
  // { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
