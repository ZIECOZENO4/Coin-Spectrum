"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaStar, FaCrown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import NoInvestmentPlanCard from "./noinvestment";
import { useFetchOneInvestmentPlan } from "@/lib/tenstack-hooks/usefetchAnInvestmentPlan";
import { useCreateInvestment } from "@/lib/tenstack-hooks/addAnewInvestment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { InvestmentPlan } from "@/lib/db/schema";

interface CreateInvestmentData {
  id: string;
  amount: number;
  name: string;
  duration: number;
  profitPercent: number;
}

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
  const router = useRouter();
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const { data: investmentPlan, isLoading, isError } = useFetchOneInvestmentPlan(id);
  const createInvestmentMutation = useCreateInvestment();

  if (isLoading) return <div><Loading /></div>;
  if (isError) return <div>Error loading investment plan</div>;
  if (!investmentPlan) return <NoInvestmentPlanCard />;

  const handleInvestClick = async () => {
    const amount = parseFloat(investmentAmount);
    
    if (isNaN(amount)) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    const minimumAmount = investmentPlan.minAmount;
    
    if (amount < minimumAmount) {
      toast.error(`Minimum investment amount is $${minimumAmount}`);
      return;
    }

    if (investmentPlan.maxAmount && amount > investmentPlan.maxAmount) {
      toast.error(`Maximum investment amount is $${investmentPlan.maxAmount}`);
      return;
    }

    const investmentData: CreateInvestmentData = {
      id: investmentPlan.id,
      amount,
      name: investmentPlan.name,
      duration: investmentPlan.durationHours,
      profitPercent: investmentPlan.roi
    };

    console.log('Investment Creation Data:', {
      'Investment ID': investmentData.id,
      'Investment Amount': investmentData.amount,
      'Plan Name': investmentData.name,
      'Duration (hours)': investmentData.duration,
      'Profit Percentage': investmentData.profitPercent
    });

    try {
      await createInvestmentMutation.mutateAsync(investmentData);
      toast.success("Investment created successfully");
      router.push("/await-confirmation");
    } catch (error) {
      console.error("Investment creation failed:", error);
      toast.error("Failed to create investment. Please try again.");
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className="text-xs text-yellow-500" />
    ));
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
              <p className="text-xs">{investmentPlan.roi}%</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">Price Range:</p>
              <p className="text-xs">
                ${investmentPlan.minAmount} - {investmentPlan.maxAmount ? `$${investmentPlan.maxAmount}` : 'Unlimited'}
              </p>
            </div>
            <div className="mb-4">
              <Input
                type="number"
                placeholder="Enter investment amount"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                min={investmentPlan.minAmount}
                max={investmentPlan.maxAmount}
                step="10"
                className="w-full p-2 rounded"
              />
            </div>
          </div>
          <div className="w-full">
            <h4 className="mb-2 text-sm font-bold">Instructions:</h4>
            <ul className="mb-4 space-y-1 list-disc list-inside">
              {commonInstructions.map((instruction, index) => (
                <li key={index} className="text-xs">{instruction}</li>
              ))}
            </ul>
            <Button
              onClick={handleInvestClick}
              className="w-full max-w-md text-white bg-orange-500 rounded-md"
              disabled={createInvestmentMutation.isPending}
            >
              {createInvestmentMutation.isPending ? "Creating Investment..." : "Invest Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="hidden md:block w-full lg:w-1/2 lg:pr-4">
        <Image
          src="/bitcoin.png"
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

