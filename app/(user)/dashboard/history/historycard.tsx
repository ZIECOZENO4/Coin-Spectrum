import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatCurrencyNaira } from "@/lib/formatCurrency";
import { TransactionType } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import { FaArrowDown, FaArrowUp, FaCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface TransactionCardProps {
  type: TransactionType | "TRADE";
  amount: number;
  date: Date;
  description: string;
  id?: string;
  direction?: "IN" | "OUT";
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  type,
  amount,
  date,
  description,
  id,
  direction,
}) => {
  const router = useRouter();
  let icon;
  let iconColor;
  let borderColor;
  let displayAmount;

  if (type === "TRADE") {
    icon = direction === "IN" ? FaArrowDown : FaArrowUp;
    iconColor = direction === "IN" ? "text-green-500" : "text-red-500";
    borderColor = direction === "IN" ? "border-green-500" : "border-red-500";
    displayAmount = `${direction === "IN" ? "+" : "-"}${formatCurrency(Number(amount))}`;
  } else {
    switch (type) {
      case TransactionType.DEPOSIT:
        icon = FaArrowDown;
        iconColor = "text-green-500";
        borderColor = "border-green-500";
        displayAmount = `+${formatCurrency(Number(amount))}`;
        break;
      case TransactionType.WITHDRAWAL:
        icon = FaArrowUp;
        iconColor = "text-red-500";
        borderColor = "border-red-500";
        displayAmount = `${formatCurrency(Number(amount))}`;
        break;
      case TransactionType.NEUTRAL:
        icon = FaCircle;
        iconColor = "text-yellow-500";
        borderColor = "border-yellow-500";
        displayAmount = `${formatCurrency(Number(amount))}`;
        break;
      default:
        icon = FaCircle;
        iconColor = "text-gray-400";
        borderColor = "border-gray-400";
        displayAmount = `${formatCurrency(Number(amount))}`;
    }
  }

  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  const formattedDate = format(date, "MMMM d, yyyy h:mm a");

  const handleClick = () => {
    router.push(`/dashboard/history/receipt?id=${id}`);
  };

  return (
    <Card
      className={`p-4 mb-4 border ${borderColor} border-2 max-w-[32rem] rounded-lg shadow-md cursor-pointer`}
      onClick={handleClick}
    >
      <CardContent className="flex items-center">
        <div className={`mr-4 ${iconColor}`}>
          {React.createElement(icon, {
            className: `${type === TransactionType.NEUTRAL ? "w-8 h-8" : "w-6 h-6"}`,
          })}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold">{description}</h3>
            <p className={`text-xs font-semibold ${iconColor}`}>{displayAmount}</p>
          </div>
          <p className="text-xxs text-gray-400">{timeAgo}</p>
          <p className="text-xxs text-gray-400">{formattedDate}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
