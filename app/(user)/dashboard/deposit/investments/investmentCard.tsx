

import { FaGem, FaCheck, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDistanceToNow } from "date-fns";

interface InvestmentCardProps {
  id: string;
  name: string;
  createdAt: string;
  status: string;
  minAmount: number;
  maxAmount: number | null;
  roi: number;
  durationHours: number;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  id,
  name,
  createdAt,
  status,
  minAmount,
  maxAmount,
  roi,
  durationHours,
}) => {
  const renderStatus = () => {
    if (status === "Pending") {
      return (
        <div className="flex items-center">
          <span>Pending</span>
          <FaSpinner className="ml-2 animate-spin" />
        </div>
      );
    }
    if (status === "Active") {
      return (
        <div className="flex items-center">
          <span>Active</span>
          <FaCheck className="ml-2 text-green-500" />
        </div>
      );
    }
    return <span>{status}</span>;
  };

  const borderColor =
    status === "Active"
      ? "border-green-500"
      : status === "Pending"
      ? "border-orange-500"
      : "border-gray-500";

  const calculateExpectedProfit = () => {
    const hourlyProfit = minAmount * (roi / 100);
    return hourlyProfit * (durationHours / 24); // Convert to daily profit
  };

  const formatPriceRange = () => {
    if (maxAmount === null) {
      return `${formatCurrency(minAmount)}+`;
    }
    return `${formatCurrency(minAmount)} - ${formatCurrency(maxAmount)}`;
  };

  return (
      <Card
        className={`w-full md:max-w-2xl md:min-w-72 lg:max-w-3xl p-3 mx-auto border-2 ${borderColor} rounded-lg shadow-lg`}
      >
        <CardContent className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">{name}</h3>
          <FaGem className="w-16 h-16 mb-4 text-orange-500" />
          <p className="text-xs mb-4">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
          <div className="w-full flex text-gray-200 justify-between mb-4">
            <p className="text-xs font-thin">Status:</p>
            <div className="text-xs font-thin">{renderStatus()}</div>
          </div>
          <div className="w-full flex justify-between mb-4">
            <p className="text-sm font-medium">Minimum Investment:</p>
            <p className="text-sm">{formatCurrency(minAmount)}</p>
          </div>
          <div className="w-full flex justify-between mb-4">
            <p className="text-sm font-medium">Investment Range:</p>
            <p className="text-sm">{formatPriceRange()}</p>
          </div>
          <div className="w-full flex justify-between mb-4">
            <p className="text-xs font-medium">ROI ({durationHours} hours):</p>
            <p className="text-xs">{roi}%</p>
          </div>
          <div className="w-full flex justify-between mb-4">
            <p className="text-xs font-medium">Expected Daily Profit:</p>
            <p className="text-xs">{formatCurrency(calculateExpectedProfit())}</p>
          </div>
        </CardContent>
      </Card>
  );
};

export default InvestmentCard;
