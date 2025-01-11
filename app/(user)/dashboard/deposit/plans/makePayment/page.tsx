import { FaCrown } from "react-icons/fa";
import InvestmentPlanCard from "./aside";
import NoInvestmentPlanCard from "../[id]/noinvestment";
import { Suspense } from "react";
import Loader from "@/components/loader";

function InvestmentPage({ searchParams }: { searchParams: { id: string } }) {
  const { id } = searchParams;
  console.log("Investment plan ID:", id);

  return (
    <div className="flex flex-col justify-center items-center mx-auto min-h-screen">
      {id ? (
        <div className="flex flex-col justify-center items-center w-full p-4">
          <h2 className="text-2xl font-bold mb-4 sm:text-3xl text-center">
            Investment Details
          </h2>
          <Suspense
            fallback={
              <Loader className="flex items-center justify-center h-[80dvh]" />
            }
          >
            <InvestmentPlanCard id={id} />
          </Suspense>
        </div>
      ) : (
        <NoInvestmentPlanCard />
      )}
    </div>
  );
}

export default InvestmentPage;
