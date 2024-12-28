import React, { Suspense } from "react";

import Loader from "@/components/loader";
import InfiniteScrollWithdrawals from "./aside";

const UserWithdrawalsPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <Loader className="flex items-center justify-center w-full min-h-[90dvh]" />
        }
      >
        <InfiniteScrollWithdrawals />
      </Suspense>
    </div>
  );
};

export default UserWithdrawalsPage;
