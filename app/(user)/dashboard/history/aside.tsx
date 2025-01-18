// components/TransactionCard.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { format, formatDistanceToNow } from "date-fns";
import { FaArrowDown, FaArrowUp, FaMoneyBillWave } from "react-icons/fa";

interface TransactionCardProps {
  type: "deposit" | "withdrawal" | "investment";
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
  const getTransactionDetails = () => {
    switch (type) {
      case "deposit":
        return {
          icon: FaArrowDown,
          iconColor: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400",
          label: "Deposit"
        };
      case "withdrawal":
        return {
          icon: FaArrowUp,
          iconColor: "text-red-500",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500",
          label: "Withdrawal"
        };
      case "investment":
        return {
          icon: FaMoneyBillWave,
          iconColor: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400",
          label: "Investment"
        };
    }
  };

  const details = getTransactionDetails();
  const Icon = details.icon;
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  const formattedDate = format(date, "MMMM d, yyyy h:mm a");

  return (
    <Card className="bg-black border-[1px] border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${details.bgColor}`}>
            <Icon className={`w-5 h-5 ${details.iconColor}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{description}</p>
                <span className={`text-xs ${details.iconColor}`}>
                  {details.label}
                </span>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${details.iconColor}`}>
                  {type === "withdrawal" ? "-" : "+"}
                  {formatCurrency(amount)}
                </p>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">{timeAgo}</span>
                  <span className="text-xs text-gray-500">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
