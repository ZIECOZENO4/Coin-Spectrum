"use client";
import { IconType } from "react-icons";
import { FaStar, FaGem } from "react-icons/fa";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatCurrency";
import { useGetAllInvestmentPlans } from "@/lib/tenstack-hooks/usefetchallinvestmentplan";

interface InvestmentPlanCardProps {
  id: string;
  name: string | null;
  priceRange: string | null;
  affiliate: string | null;
  price: number;
  duration: number;
  durationDays: number;
  profitPercent: number;
  rating: number;
  depositFee: string;
}

const InvestmentPlanCard: React.FC<InvestmentPlanCardProps> = ({
  name,
  id,
  priceRange,
  affiliate,
  durationDays,
  price,
  duration,
  profitPercent,
  rating,
  depositFee,
}) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    }
    return stars;
  };

  return (
    <Card className="w-full md:max-w-2xl md:min-w-72 p-6 mx-auto border-2 border-orange-500 rounded-lg shadow-lg">
      <CardContent className="flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-4">{name}</h3>
        <FaGem className="w-16 h-16 mb-4 text-orange-500" />
        <div className="flex mb-4">{renderStars()}</div>
        <div className="w-full flex text-gray-200 justify-between mb-4">
          <p className="text-sm font-thin">Profit(%):</p>
          <p className="text-sm font-thin">{profitPercent}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium">Price Range:</p>
          <p className="text-lg">{priceRange}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium">Price:</p>
          <p className="text-lg">{formatCurrency(price)}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium">Duration(hrs):</p>
          <p className="text-lg">{duration}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium">Duration(days):</p>
          <p className="text-lg">{durationDays}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium"> Affiliate(%):</p>
          <p className="text-lg">{affiliate}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-lg font-medium"> Fee($):</p>
          <p className="text-lg">{depositFee}</p>
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
    <div className="  mx-auto  ">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-100">Our Plans</h2>
        <p className="mt-4 text-lg text-gray-200">
          Choose the best investment plan that suits you.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8">
        {plans.map((plan) => (
          <InvestmentPlanCard
          id={plan.id}
            key={plan.name}
            name={plan.name}
            price={plan.price}
            profitPercent={plan.profitPercent}
            rating={plan.rating}
            priceRange={plan.priceRange}
            affiliate={plan.affiliate}
            durationDays={plan.durationDays}
            duration={plan.duration}
            depositFee={plan.depositFee}
          />
        ))}
      </div>
    </div>
  );
};

export default InvestmentPlans;
