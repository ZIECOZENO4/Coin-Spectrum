import React, { Suspense } from "react";
import InvestmentPlans from "./aside";
import Loader from "@/components/loader";

const PlansPage = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <Suspense
        fallback={
          <Loader className="flex items-center justify-center h-full w-full" />
        }
      >
        <InvestmentPlans />
      </Suspense>
    </div>
  );
};

export default PlansPage;
