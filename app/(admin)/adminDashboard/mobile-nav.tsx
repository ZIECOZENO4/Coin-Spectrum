"use client";
import Link from "next/link";
import {
  MdHome,
  MdChatBubbleOutline,
  MdNotifications,
  MdPersonOutline,
} from "react-icons/md";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface Menu {
  name: string;
  icon: JSX.Element;
  href: string;
}

const Menus: Menu[] = [
  {
    name: "dashboard",
    icon: <MdHome className=" text-xl" />,
    href: "/adminDashboard",
  },
  {
    name: "all investments",
    icon: <MdChatBubbleOutline className=" text-xl" />,
    href: "/adminDashboard/allInvestments",
  },
  {
    name: "all users",
    icon: <MdNotifications className=" text-xl" />,
    href: "/adminDashboard/allUsers",
  },
  {
    name: "all withdrawal",
    icon: <MdPersonOutline className=" text-xl" />,
    href: "/adminDashboard/allWithdrawal",
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  const isRouteActive = (href: string): boolean => {
    if (href === "/user-dashboard") {
      return pathname === href;
    }
    return (
      pathname.startsWith(href) &&
      (pathname === href || pathname.charAt(href.length) === "/")
    );
  };
  return (
    <nav className=" md:hidden bg-gray-950 shadow-typography d fixed inset-x-0 bottom-0">
      <div className="grid grid-cols-4 gap-0.5 py-1">
        {Menus.map((menu, index) => (
          <Link
            href={menu.href}
            key={index}
            className={cn(
              "flex flex-col items-center justify-center py-1 text-xs font-medium transition-colors",
              {
                "text-gray-900 dark:text-gray-50 -translate-y-2 transition-all ":
                  isRouteActive(menu.href),
                "text-gray-400 hover:text-gray-900 dark:text-gray-600 dark:hover:text-gray-50":
                  !isRouteActive(menu.href),
              }
            )}
          >
            <div
              className={cn(
                "flex flex-col items-center justify-center  text-xs font-medium transition-colors",
                { "text-rose-500": isRouteActive(menu.href) }
              )}
            >
              {menu.icon}
              {menu.name}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
