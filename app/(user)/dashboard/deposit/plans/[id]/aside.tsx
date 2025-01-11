"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaStar, FaCrown, FaGem } from "react-icons/fa";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatCurrency";
import Image from "next/image";
import NoInvestmentPlanCard from "./noinvestment";
import { useFetchOneInvestmentPlan } from "@/lib/tenstack-hooks/usefetchAnInvestmentPlan";

// Common instructions for all investment plans
const commonInstructions = [
  "Sign up for an account on our platform",
  "Select the desired investment plan",
  "Make a deposit of the corresponding investment amount",
  "Start earning daily profits based on the selected plan",
  "Withdraw your total profit at the end of the investment period",
];

interface InvestmentPlanCardProps {
  id: string;
}

const InvestmentPlanCard: React.FC<InvestmentPlanCardProps> = ({ id }) => {
  const { data: investmentPlan, isLoading, isError } = useFetchOneInvestmentPlan(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading investment plan</div>;
  if (!investmentPlan) return <NoInvestmentPlanCard />;

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<FaStar key={i} className="text-xs text-yellow-500" />);
    }
    return stars;
  };  

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8">
      <Card className="w-full lg:w-1/2 max-w-[36rem] p-4 mx-auto border-2 container border-orange-500 rounded-lg shadow-lg mt-8 lg:mt-0 lg:ml-4">
        <CardContent className="flex flex-col gap-8 items-center">
          <div className="relative flex flex-col items-center w-full mt-8 mb-4">
            <FaCrown className="-top-8 absolute w-16 h-16 mb-2 text-orange-500" />
          </div>
          <div className="flex flex-row">{renderStars()}</div>
          <div className="w-full">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-bold">Investment Name:</p>
              <p className="text-sm">{investmentPlan.name}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-xs font-medium">ROI:</p>
              <p className="text-xs">
                {investmentPlan.roi} %
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">Price Range:</p>
              <p className="text-xs">${investmentPlan.minAmount} - ${investmentPlan.maxAmount}</p>
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
              href={`/dashboard/deposit/plans/makePayment?id=${investmentPlan.id}`}
              className={`w-full max-w-md text-center ${buttonVariants()} text-white rounded-md`}
            >
              Invest Now
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="hidden md:block w-full lg:w-1/2 lg:pr-4">
        <Image
          src={"/bitcoin.png"}
          alt={`${investmentPlan.name} Image`}
          width={500}
          height={500}
          className="object-cover w-full h-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default InvestmentPlanCard;
