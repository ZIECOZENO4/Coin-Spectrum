// types/layout.ts
import { ReactNode } from "react";

import dynamic from "next/dynamic";
import Sidebar from "./sidebar";
// import MobileNav from "./mobile-nav";
import WithUserRoleCheck from "./mustBeAdmin";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <WithUserRoleCheck>
      <div className=" relative flex">
        <Sidebar />

        <main className="w-full">{children}</main>
        {/* <MobileNav /> */}
      </div>
    </WithUserRoleCheck>
  );
};

export default Layout;
