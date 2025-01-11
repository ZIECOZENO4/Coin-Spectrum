import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaCrown } from "react-icons/fa";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrencyNaira } from "@/lib/formatCurrency";
import Image from "next/image";
import NoInvestmentPlanCard from "./noinvestment";
import { useGetAllInvestmentPlans } from "@/lib/tenstack-hooks/usefetchallinvestmentplan";

interface InvestmentPlanResponse {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number | null;
  roi: number;
  durationHours: number;
  instantWithdrawal: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InvestmentPlanCardProps {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number | null;
  roi: number;
  durationHours: number;
  instantWithdrawal: boolean;
}

const commonInstructions = [
  "Sign up for an account on our platform",
  "Select the desired investment plan",
  "Make a deposit of the corresponding investment amount",
  "Start earning profits based on the selected plan",
  "Withdraw your profits when available",
];

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
      return `${formatCurrencyNaira(minAmount)}+`;
    }
    return `${formatCurrencyNaira(minAmount)} - ${formatCurrencyNaira(maxAmount)}`;
  };

  const calculateDailyProfit = () => {
    return (roi / 100) * minAmount * (24 / durationHours);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8">
      <div className="hidden md:block w-full lg:w-1/2 lg:pr-4">
        <Image
          src="/"
          alt={`${name} Image`}
          width={500}
          height={500}
          className="object-cover w-full h-full rounded-lg shadow-lg"
        />
      </div>
      <Card className="w-full lg:w-1/2 max-w-[36rem] p-4 mx-auto border-2 container border-orange-500 rounded-lg shadow-lg mt-8 lg:mt-0 lg:ml-4">
        <CardContent className="flex flex-col items-center">
          <div className="relative flex flex-col items-center w-full mt-8 mb-4">
            <FaCrown className="-top-8 absolute w-16 h-16 mb-2 text-orange-500" />
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-bold">Plan Name:</p>
              <p className="text-sm">{name}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-xs font-medium">Daily Profit:</p>
              <p className="text-xs">
                {formatCurrencyNaira(calculateDailyProfit())}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">Investment Range:</p>
              <p className="text-xs">{formatPriceRange()}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">ROI:</p>
              <p className="text-xs">{roi}%</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">Duration (hours):</p>
              <p className="text-xs">{durationHours}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">Instant Withdrawal:</p>
              <p className="text-xs">{instantWithdrawal ? "Yes" : "No"}</p>
            </div>
          </div>
          <div className="w-full">
            <h4 className="mb-2 text-sm font-bold">Instructions:</h4>
            <ul className="mb-4 space-y-1 list-disc list-inside">
              {commonInstructions.map((instruction, index) => (
                <li key={index} className="text-xs">
                  {instruction}
                </li>
              ))}
            </ul>
            <Link
              href={`/dashboard/makePayment?plan=${id}`}
              className={`w-full max-w-md text-center ${buttonVariants()} text-white rounded-md`}
            >
              Invest Now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InvestmentPlans: React.FC = () => {
  const { data: plans, isLoading, error } = useGetAllInvestmentPlans();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading investment plans</div>;
  if (!plans || plans.length === 0) return <NoInvestmentPlanCard />;

  return (
    <div className="mx-auto">
   {plans.map((plan: InvestmentPlanResponse) => (
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
  );
};

export default InvestmentPlans;
