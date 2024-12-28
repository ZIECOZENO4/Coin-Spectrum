import React from "react";

type UserBalanceCardProps = {
  balance: number;
};

const UserBalanceCard: React.FC<UserBalanceCardProps> = ({ balance }) => {
  return (
    <div className="relative w-full max-w-sm mx-auto bg-gray-800 text-white rounded-lg overflow-hidden">
      <div className="relative z-10 p-6">
        <h2 className="text-xl font-bold">Available Balance</h2>
        <p className="mt-4 text-3xl">${balance.toFixed(2)}</p>
      </div>
      <div
        className="absolute inset-0 w-full h-full bg-neutral-950"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)" }}
      ></div>
      <div
        className="absolute inset-0 w-full h-full bg-orange-500"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 60% 100%, 100% 60%)" }}
      ></div>
    </div>
  );
};
