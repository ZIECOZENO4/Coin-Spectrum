import React, { Suspense } from "react";
import InfiniteScrollComponent from "./aside";
import Loader from "@/components/loader";

const AllInvestmentPage = () => {
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

export default AllInvestmentPage;
