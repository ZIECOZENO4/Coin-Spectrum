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
      
      try {
        const banStatusUrl = `${request.nextUrl.origin}/api/user/ban-status`;
        console.log("📡 Middleware: Making request to:", banStatusUrl);
        
        const response = await fetch(banStatusUrl, {
          headers: {
            'Authorization': request.headers.get('authorization') || '',
            'Cookie': request.headers.get('cookie') || '',
          },
        });

        console.log("📊 Middleware: Ban status response:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("📋 Middleware: Ban status data:", data);
          
          if (data.banned) {
            console.log("🚫 Middleware: User is BANNED - redirecting to /banned");
            return NextResponse.redirect(new URL('/banned', request.url));
          } else {
            console.log("✅ Middleware: User is NOT banned - allowing access");
          }
        } else {
          console.log("❌ Middleware: Ban status check failed with status:", response.status);
        }
      } catch (error) {
        console.error("💥 Middleware: Error checking ban status:", error);
        // Continue with request if ban check fails
      }
    } else {
      console.log("⏭️ Middleware: Skipping ban check - User:", auth().userId, "Admin route:", isAdminRoute(request));
    }
  }
  // { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
