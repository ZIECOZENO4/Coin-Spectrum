import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { FaAngrycreative, FaChartLine } from "react-icons/fa";
import Link from "next/link";
import { AngryIcon } from "lucide-react";

const NoWithdrawalIdFound: React.FC = () => {
  return (
    <div className="flex justify-center items-center container ">
      <Card className="w-full max-w-[50rem] p-8 mx-auto  bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-xl rounded-lg border  border-red-500">
        <CardContent className="flex flex-col items-center">
          <AngryIcon className=" mb-8 h-8 w-8 text-red-500" />
          <h2 className="text-3xl font-bold mb-4 text-center ">
            There is no withdrawal ID found
          </h2>
          <p className="text-lg mb-8 text-center ">
            Please select a withdrawal that has an ID
          </p>
          <Link
            href={"/adminDashboard/allWithdrawals"}
            className={`px-8 py-3 text-xl font-semibold ${buttonVariants()} bg-red-700  rounded-lg shadow-md max-w-md `}
          >
            All Withdrawals
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoWithdrawalIdFound;
