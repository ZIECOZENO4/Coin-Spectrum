import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDistanceToNow } from "date-fns";

interface WithdrawalCardProps {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  walletAddress: string;
  cryptoType: string;
}

const WithdrawalCard: React.FC<WithdrawalCardProps> = ({
  id,
  amount,
  status,
  createdAt,
  walletAddress,
  cryptoType,
}) => {
  const renderStatus = () => {
    if (status === "UNCONFIRMED") {
      return <span className="text-yellow-500">Unconfirmed</span>;
    }
    if (status === "CONFIRMED") {
      return <span className="text-green-500">Confirmed</span>;
    }
    return <span>{status}</span>;
  };

  return (
    <Card className="w-full md:max-w-2xl md:min-w-72 lg:max-w-3xl p-3 mx-auto border-2 rounded-lg shadow-lg">
      <CardContent className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4">Withdrawal</h3>
        <p className="text-xs mb-4">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
        <div className="w-full flex justify-between mb-4">
          <p className="text-sm font-medium">Amount:</p>
          <p className="text-sm">{formatCurrency(amount)}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-sm font-medium">Status:</p>
          <p className="text-sm">{renderStatus()}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-sm font-medium">Wallet Address:</p>
          <p className="text-sm">{walletAddress}</p>
        </div>
        <div className="w-full flex justify-between mb-4">
          <p className="text-sm font-medium">Crypto Type:</p>
          <p className="text-sm">{cryptoType}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WithdrawalCard;
