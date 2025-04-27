// InvestmentPage.tsx
import { FaCrown } from "react-icons/fa";
import NoInvestmentPlanCard from "./noinvestment";
import InvestmentPlanCard from "./aside";
import { Suspense } from "react";
import Loader from "@/components/loader";
import { useRouter } from 'next/router';

function InvestmentPage({ params }: { params: { id: string } }) {
  const { id } = params;
 

  if (!id) {
    return <NoInvestmentPlanCard />;
  }

  return (
    <div className="w-full mb-10 flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 sm:text-3xl text-center">
          Investment Details
        </h2>
        <Suspense
          fallback={
            <Loader className="h-full flex justify-center items-center" />
          }
        >
          <InvestmentPlanCard id={id} />
        </Suspense>
      </div>
    </div>
  );
}

export default InvestmentPage;
