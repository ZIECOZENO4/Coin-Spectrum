import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { FaAngrycreative, FaChartLine } from "react-icons/fa";
import Link from "next/link";
import { AngryIcon, SmileIcon } from "lucide-react";
const NoInvestmentPlanCard: React.FC = () => {
  return (
    <div className=" container flex items-center justify-center">
      <Card className="w-full max-w-[50rem] p-8 mx-auto  bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-xl rounded-lg border  border-green-500">
        <CardContent className="flex flex-col items-center">
          <SmileIcon className=" w-8 h-8 mb-8 text-green-500" />
          <h2 className=" mb-4 text-3xl font-bold text-center">
            Your request for withdrawal is successful any problem should be
            reported to our customer care .
          </h2>
          <p className=" mb-8 text-lg text-center">
            you would be paid within 24 hours
          </p>
          <Link
            href={
              "/dashboard?tab=withdrawals&withdrawalStatusFilter=UNCONFIRMED"
            }
            className={`px-8 py-3 text-xl font-semibold ${buttonVariants()} bg-red-700  rounded-lg shadow-md max-w-md `}
          >
            Go To Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoInvestmentPlanCard;
