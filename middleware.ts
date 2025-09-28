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
      console.log("🔍 Middleware: Checking ban status for user:", auth().userId);
      console.log("🌐 Middleware: Request URL:", request.url);
      console.log("🛡️ Middleware: Is admin route:", isAdminRoute(request));
      
      // For now, let the BannedProvider handle the ban check
      // This avoids circular API calls in middleware
      console.log("⏭️ Middleware: Delegating ban check to BannedProvider component");
    } else {
      console.log("⏭️ Middleware: Skipping ban check - User:", auth().userId, "Admin route:", isAdminRoute(request));
    }
  }
  // { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
