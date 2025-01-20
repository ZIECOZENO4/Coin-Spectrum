// layout.tsx
import { ReactNode } from "react";
import Sidebar from "./sidebar";
import { AuthProvider } from "./AuthProvider";
import ClientLayout from "./ClientLayout";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <ClientLayout>{children}</ClientLayout>
    </AuthProvider>
  );
}
