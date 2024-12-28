// Assuming this is a server component in Next.js 13.5 or later
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import checkUserRoleAndRedirect, { getUserAuth } from "@/lib/auth/utils";

interface WithUserRoleCheckProps {
  children: ReactNode;
}

// This function simulates checking the user's role. Replace it with your actual logic.
// Note: Direct database access or other server-side logic to determine the user role goes here.

export default async function WithUserRoleCheck({
  children,
}: WithUserRoleCheckProps) {
  const { session } = await getUserAuth();
  if (!session) {
    redirect("/blocked");
  }
  await checkUserRoleAndRedirect(session.user.id);

  // If the function above doesn't throw, the user is an admin, and children are rendered.
  return <>{children}</>;
}
