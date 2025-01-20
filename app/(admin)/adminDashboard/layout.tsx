// // types/layout.ts
// import { ReactNode } from "react";

// import dynamic from "next/dynamic";
// import Sidebar from "./sidebar";
// // import MobileNav from "./mobile-nav";
// import WithUserRoleCheck from "./mustBeAdmin";
// import { AuthProvider } from "./AuthProvider";

// interface LayoutProps {
//   children: ReactNode;
// }

// const Layout = ({ children }: LayoutProps) => {
//   return (
//     <WithUserRoleCheck>
//        <AuthProvider>
//        <div className=" relative flex">
//         <Sidebar />

//         <main className="w-full">  
         
//           {children}
//         </main>
//         {/* <MobileNav /> */}
//       </div>
//        </AuthProvider>
    
//     </WithUserRoleCheck>
//   );
// };

// export default Layout;


// components/Layout.tsx
"use client";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import Sidebar from "./sidebar";
import WithUserRoleCheck from "./mustBeAdmin";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./AuthProvider";
import Auth from "./auth";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <WithUserRoleCheck>
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </WithUserRoleCheck>
  );
};

// Separate component to use the useAuth hook
const LayoutContent = ({ children }: LayoutProps) => {
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
};

export default Layout;
