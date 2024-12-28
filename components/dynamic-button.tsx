"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import ShineBorder from "./ui/shine-border-button";

export const DynamicButton = () => {
  const searchParams = useSearchParams();
  const refParams = searchParams.get("ref");
  const ref = refParams ? refParams : "noRef";

  return (
    <div className="relative cursor-pointer">
      <SignedIn>
        <Link href={"/sync-user"} title="" role="button" className="mx-auto">
          <ShineBorder
            className="text-center text-sm font-bold  capitalize md:text-lg"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            Invest Now
          </ShineBorder>
        </Link>
      </SignedIn>
      <SignedOut>
        <ShineBorder
          className="text-center text-sm font-bold  capitalize md:text-lg"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <SignInButton
            // mode="modal"
            fallbackRedirectUrl={`/sync-user?ref=${ref}`}
            forceRedirectUrl={`/sync-user?ref=${ref}`}
            signUpFallbackRedirectUrl={`/sync-user?ref=${ref}`}
            signUpForceRedirectUrl={`/sync-user?ref=${ref}`}
          >
            Invest Now
          </SignInButton>
        </ShineBorder>
      </SignedOut>
    </div>
  );
};

// "use client";
// import { buttonVariants } from "@/components/ui/button";

// import Link from "next/link";
// import React from "react";

// export const DynamicButton = () => {
//   return (
//     <div className="relative">
//       <Link
//         href="/dashboard"
//         className={`inline-flex items-center justify-center px-3 sm:px-5 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-red-500 ${buttonVariants()} hover:bg-red-700 md:py-4 md:text-lg md:px-10 cursor-pointer dark:bg-red-600 dark:hover:bg-red-800`}
//       >
//         Invest Now
//       </Link>
//     </div>
//   );
// };
