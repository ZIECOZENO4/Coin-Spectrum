
// "use client";
// import { Menu, X } from "lucide-react";
// import { useState } from "react";
// import Link from "next/link";
// import { Button } from "./ui/button";
// import { usePathname, useSearchParams } from "next/navigation"; // Import the usePathname hook
// import Image from "next/image";
// import {
//   SignInButton,
//   SignOutButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from "@clerk/nextjs";
// import { ModeToggle } from "./ui/ThemeToggle";
// import MenuIcon from "./dashboard/menuIcon"; // Ensure this import is correct
// export const navItems = [
//   { label: "Home", href: "/" },
//   { label: "Services", href: "/features" },
//   { label: "Investments", href: "/invest" },
//   { label: "Trades", href: "/trade" },
//   { label: "About us", href: "/about" },
// ];

// const AuthButtons = () => {
//   const searchParams = useSearchParams();
//   const refParams = searchParams.get("ref");
//   const ref = refParams ? refParams : "noRef";

//   return (
//     <>
//       <SignedIn>
//         <div className="flex flex-row items-center justify-between gap-4">
//           <Link
//             href="/dashboard"
//             className="px-3 py-2 border rounded-md dark:border-neutral-700"
//           >
//             Dashboard
//           </Link>
//           <SignOutButton redirectUrl="/sign-in">LogOut</SignOutButton>
//           <UserButton />
//         </div>
//       </SignedIn>
//       <SignedOut>
//         <SignInButton
//           mode="modal"
//           fallbackRedirectUrl={`/sync-user`}
//           forceRedirectUrl={`/sync-user`}
//           signUpFallbackRedirectUrl={`/sync-user`}
//           signUpForceRedirectUrl={`/sync-user`}
//         >
//           <Button className="px-3 py-2 border rounded-md dark:border-neutral-700">
//             Sign In
//           </Button>
//         </SignInButton>
//         <SignUpButton
//           fallbackRedirectUrl={`/sync-user?ref=${ref}`}
//           forceRedirectUrl={`/sync-user?ref=${ref}`}
//           signInForceRedirectUrl={`/sync-user?ref=${ref}`}
//           signInFallbackRedirectUrl={`/sync-user?ref=${ref}`}
//         >
//           <Button className="bg-gradient-to-r from-orange-500 to-orange-800 px-3 py-2 rounded-md">
//             Create an account
//           </Button>
//         </SignUpButton>
//       </SignedOut>
//     </>
//   );
// };

// const Navbar = () => {
//   const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
//   const pathname = usePathname(); // Get the current pathname

//   const toggleNavbar = () => {
//     setMobileDrawerOpen(!mobileDrawerOpen);
//   };

//   const handleDashboardMenuClick = (e: any) => {
//     e.stopPropagation(); // Prevent the event from propagating
//     // Additional logic can be added here if needed
//   };

//   return (
//     <nav className="border-neutral-700/80 backdrop-blur-lg sticky top-0 z-50 py-3 border-b dark:bg-neutral-900">
//       <div className="lg:text-sm container relative px-4 mx-auto">
//         <div className="flex items-center justify-between">
//           <Link href={"/"} className="flex items-center flex-shrink-0">
//             <Image
//               className="mr-2"
//               src={"/cs.png"}
//               width={40}
//               height={40}
//               alt="Logo"
//             />

//             <span className="text-sm tracking-tight dark:text-neutral-100">
//               Coin Spectrum
//             </span>
//           </Link>
//           <ul className="ml-14 lg:flex hidden space-x-12 dark:text-neutral-100">
//           {navItems.map((item, index) => (
//           <li key={index} className="relative">
//             <Link 
//               href={item.href}
//               className={`${
//                 pathname === item.href
//                   ? "text-yellow-600 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-yellow-600"
//                   : ""
//               }`}
//             >
//               {item.label}
//             </Link>
//           </li>
//         ))}
//           </ul>
//           <div className="lg:flex items-center justify-center hidden space-x-12">
//             <AuthButtons />
//             <ModeToggle />
//           </div>
//           <div className="md:flex lg:hidden flex-col justify-end">
//             <div
//               onClick={
//                 pathname.includes("dashboard")
//                   ? handleDashboardMenuClick
//                   : toggleNavbar
//               }
//               className="text-neutral-900 flex flex-row justify-center items-center gap-2 dark:text-neutral-100"
//             >
//               {mobileDrawerOpen ? (
//                 <X />
//               ) : pathname.includes("dashboard") ? (
//                 <MenuIcon />
//               ) : (
//                 <Menu />
//               )}
//               <ModeToggle />
//             </div>
//           </div>
//         </div>
//         {mobileDrawerOpen && (
//           <div className="bg-neutral-50 dark:bg-neutral-900 lg:hidden fixed right-0 z-20 flex flex-col items-center justify-center w-full p-12">
//             <ul className="space-y-4 dark:text-neutral-100">
//             {navItems.map((item, index) => (
//           <li key={index} className="relative">
//             <Link 
//               href={item.href}
//               className={`${
//                 pathname === item.href
//                   ? "text-yellow-600 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-yellow-600"
//                   : ""
//               }`}
//             >
//               {item.label}
//             </Link>
//           </li>
//         ))}
//             </ul>
//             <div className="flex space-x-6 mt-8">
//               <AuthButtons />
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


"use client";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ModeToggle } from "./ui/ThemeToggle";
import MenuIcon from "./dashboard/menuIcon";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/features" },
  { label: "Investments", href: "/invest" },
  { label: "Trades", href: "/trade" },
  { label: "About us", href: "/about" },
];

const AuthButtons = () => {
  const searchParams = useSearchParams();
  const refParams = searchParams.get("ref");
  const ref = refParams ? refParams : "noRef";

  return (
    <>
      <SignedIn>
        <div className="flex flex-row items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="px-3 py-2 border rounded-md dark:border-neutral-700"
          >
            Dashboard
          </Link>
          <SignOutButton redirectUrl="/sign-in">LogOut</SignOutButton>
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton
          mode="modal"
          fallbackRedirectUrl={`/sync-user`}
          forceRedirectUrl={`/sync-user`}
          signUpFallbackRedirectUrl={`/sync-user`}
          signUpForceRedirectUrl={`/sync-user`}
        >
          <Button className="px-3 py-2 border rounded-md dark:border-neutral-700">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton
          fallbackRedirectUrl={`/sync-user?ref=${ref}`}
          forceRedirectUrl={`/sync-user?ref=${ref}`}
          signInForceRedirectUrl={`/sync-user?ref=${ref}`}
          signInFallbackRedirectUrl={`/sync-user?ref=${ref}`}
        >
          <Button className="bg-gradient-to-r from-orange-500 to-orange-800 px-3 py-2 rounded-md">
            Create an account
          </Button>
        </SignUpButton>
      </SignedOut>
    </>
  );
};

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const toggleButton = document.querySelector(".mobile-toggle-button");
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !toggleButton?.contains(event.target as Node)
      ) {
        setMobileDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNavbar = () => {
    if (!pathname.includes("dashboard")) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    }
  };

  const handleDashboardMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Ensure menu is closed when dashboard route loads
  useEffect(() => {
    if (pathname.includes("dashboard")) {
      setMobileDrawerOpen(false);
    }
  }, [pathname]);

  return (
    <nav className="border-neutral-700/80 backdrop-blur-lg sticky top-0 z-50 py-3 border-b dark:bg-neutral-900">
      <div className="lg:text-sm container relative px-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link href={"/"} className="flex items-center flex-shrink-0">
            <Image
              className="mr-2"
              src={"/cs.png"}
              width={40}
              height={40}
              alt="Logo"
            />
            <span className="text-xl md:text-2xl font-bold tracking-tight dark:text-neutral-100">
              Coin Spectrum
            </span>
          </Link>
          <ul className="ml-14 lg:flex hidden space-x-12 dark:text-neutral-100">
            {navItems.map((item, index) => (
              <li key={index} className="relative">
                <Link
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? "text-yellow-600 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-yellow-600"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="lg:flex items-center justify-center hidden space-x-12">
            <AuthButtons />
            <ModeToggle />
          </div>
          <div className="md:flex lg:hidden flex-col justify-end">
            <div
              onClick={
                pathname.includes("dashboard")
                  ? handleDashboardMenuClick
                  : toggleNavbar
              }
              className="mobile-toggle-button text-neutral-900 flex flex-row justify-center items-center gap-2 dark:text-neutral-100"
            >
              {mobileDrawerOpen ? (
                <X />
              ) : pathname.includes("dashboard") ? (
                <MenuIcon />
              ) : (
                <Menu />
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div
            ref={mobileMenuRef}
            className="bg-neutral-50 dark:bg-neutral-900 lg:hidden fixed right-0 z-20 flex flex-col items-center justify-center w-full p-12"
          >
            <ul className="space-y-4 dark:text-neutral-100">
              {navItems.map((item, index) => (
                <li key={index} className="relative">
                  <Link
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? "text-yellow-600 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-yellow-600"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6 mt-8">
              <AuthButtons />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
