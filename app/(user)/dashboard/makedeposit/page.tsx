import { FaCrown } from "react-icons/fa";
import { Suspense } from "react";
import Loader from "@/components/loader";
import DepositCard from "./DepositCard";

function DepositPage() {

  return (
    <div className="flex flex-col justify-center items-center mx-auto min-h-screen">
        <div className="flex flex-col justify-center items-center w-full p-4">
          <h2 className="text-2xl font-bold mb-4 sm:text-3xl text-center">
            Quick Deposit
          </h2>
          <Suspense
            fallback={
              <Loader className="flex items-center justify-center h-[80dvh]" />
            }
          >
         <DepositCard />
          </Suspense>
        </div>
    </div>
  );
}

export default DepositPage;
