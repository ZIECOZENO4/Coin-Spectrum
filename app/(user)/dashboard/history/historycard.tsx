import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatCurrencyNaira } from "@/lib/formatCurrency";
import { TransactionType } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import { FaArrowDown, FaArrowUp, FaCircle } from "react-icons/fa";

interface TransactionCardProps {
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  type,
  amount,
  date,
  description,
}) => {
  let icon;
  let iconColor;
  let borderColor;

  switch (type) {
    case TransactionType.DEPOSIT:
      icon = FaArrowDown;
      iconColor = "text-green-500";
      borderColor = "border-green-500";
      break;
    case TransactionType.WITHDRAWAL:
      icon = FaArrowUp;
      iconColor = "text-red-500";
      borderColor = "border-red-500";
      break;
    case TransactionType.NEUTRAL:
      icon = FaCircle;
      iconColor = "text-yellow-500";
      borderColor = "border-yellow-500";
      break;
  }

  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  const formattedDate = format(date, "MMMM d, yyyy h:mm a");

  return (
    <Card
      className={`p-4 mb-4 border ${borderColor} border-2 max-w-[32rem] rounded-lg shadow-md`}
    >
      <CardContent className="flex items-center">
        <div className={`mr-4 ${iconColor}`}>
          {React.createElement(icon, {
            className: `${
              type === TransactionType.NEUTRAL ? "w-8 h-8" : "w-6 h-6"
            }`,
          })}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold">{description}</h3>
            <p className={`text-xs font-semibold ${iconColor}`}>
              {type === TransactionType.NEUTRAL
                ? `${formatCurrency(Number(amount))}`
                : `${
                    type === TransactionType.DEPOSIT ? "+" : "-"
                  }${formatCurrency(Number(amount))}`}
            </p>
          </div>
          <p className="text-xxs text-gray-400">{timeAgo}</p>
          <p className="text-xxs text-gray-400">{formattedDate}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
