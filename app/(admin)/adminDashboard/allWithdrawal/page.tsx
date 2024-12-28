// page.tsx
import React, { Suspense } from "react";
import Withdrawals from "./aside";
import Loader from "@/components/loader";

const Page = () => {
  return (
    <div>
      <Suspense
        fallback={
          <Loader className="flex items-center justify-center min-h-[60]" />
        }
      >
        <Withdrawals />
      </Suspense>
    </div>
  );
};

export default Page;
