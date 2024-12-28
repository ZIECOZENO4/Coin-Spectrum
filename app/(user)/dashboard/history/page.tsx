import React, { Suspense } from "react";
import Loader from "@/components/loader";
import InfiniteScrollComponent from "./aside";

const TransactionsPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <Loader className="flex items-center justify-center w-full min-h-[90dvh]" />
        }
      >
        <InfiniteScrollComponent />
      </Suspense>
    </div>
  );
};

export default TransactionsPage;
