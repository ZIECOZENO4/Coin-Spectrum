// ClientLayout.tsx
"use client";
import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import Auth from "./auth";
import Sidebar from "./sidebar";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="relative flex">
      <Sidebar />
      <main className="w-full">{children}</main>
    </div>
  );
}
