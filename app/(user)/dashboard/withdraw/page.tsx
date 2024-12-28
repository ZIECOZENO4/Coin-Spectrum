import React, { Suspense } from "react";
import { WithdrawalInput } from "./aside";
import Loader from "@/components/loader";

const WithdrawalPage = () => {
  return (
    <div className="flex w-full items-center justify-center min-h-screen">
      <div className="w-full max-w-[42rem]">
        <Suspense fallback={<Loader className="h-full w-full " />}>
          <WithdrawalInput />
        </Suspense>
      </div>
    </div>
  );
};

export default WithdrawalPage;
