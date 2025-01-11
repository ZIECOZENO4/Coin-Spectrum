// 

"use client";
import { FaGem } from "react-icons/fa";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatCurrency";
import { useGetAllInvestmentPlans } from "@/lib/tenstack-hooks/usefetchallinvestmentplan";
import { InvestmentPlan } from "@/lib/db/schema";

interface InvestmentPlanCardProps {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number | null;
  roi: number;
  durationHours: number;
  instantWithdrawal: boolean;
}

const InvestmentPlanCard: React.FC<InvestmentPlanCardProps> = ({
  id,
  name,
  minAmount,
  maxAmount,
  roi,
  durationHours,
  instantWithdrawal,
}) => {
  const formatPriceRange = () => {
    if (maxAmount === null) {
      return `${formatCurrency(minAmount)}+`;
    }
    return `${formatCurrency(minAmount)} - ${formatCurrency(maxAmount)}`;
  };

  const calculateDailyProfit = () => {
    return (roi / 100) * minAmount * (24 / durationHours);
  };

  return (
    <Card className="w-full md:max-w-2xl md:min-w-72 p-6 mx-auto border-2 border-orange-500 rounded-lg shadow-lg">
      <CardContent className="flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-4">{name}</h3>
        <FaGem className="w-16 h-16 mb-4 text-orange-500" />
        <div className="w-full flex text-gray-200 justify-between mb-4">
          <p className="text-sm font-thin">ROI(%):</p>
          <p className="text-sm font-thin">{roi}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium">Investment Range:</p>
          <p className="text-lg">{formatPriceRange()}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium">Minimum Investment:</p>
          <p className="text-lg">{formatCurrency(minAmount)}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium">Duration(hrs):</p>
          <p className="text-lg">{durationHours}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium">Daily Profit:</p>
          <p className="text-lg">{formatCurrency(calculateDailyProfit())}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium">Instant Withdrawal:</p>
          <p className="text-lg">{instantWithdrawal ? "Yes" : "No"}</p>
        </div>
        <Link
          href={`/dashboard/deposit/plans/${id}`}
          className={`${buttonVariants()} w-full text-center`}
        >
          Invest Now
        </Link>
      </CardContent>
    </Card>
  );
};

const InvestmentPlans: React.FC = () => {
  const { data: plans } = useGetAllInvestmentPlans();
  
  return (
    <div className="mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-100">Our Plans</h2>
        <p className="mt-4 text-lg text-gray-200">
          Choose the best investment plan that suits you.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {plans?.map((plan: InvestmentPlan) => (
          <InvestmentPlanCard
            key={plan.id}
            id={plan.id}
            name={plan.name}
            minAmount={plan.minAmount}
            maxAmount={plan.maxAmount}
            roi={plan.roi}
            durationHours={plan.durationHours}
            instantWithdrawal={plan.instantWithdrawal}
          />
        ))}
      </div>
    </div>
  );
};

export default InvestmentPlans;
