"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaDollarSign, FaMoneyBillWave, FaChartLine, FaExchangeAlt } from "react-icons/fa";

type UserBalanceCardProps = {
  title: string;
  value: number | string;
  isClickable?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
};

const UserBalanceCard: React.FC<UserBalanceCardProps> = ({
  title,
  value,
  isClickable,
  onClick,
  icon,
}) => {
  return (
    <div
      className={`relative w-full max-w-sm mx-auto h-40 text-white rounded-lg overflow-hidden mb-4 ${
        isClickable ? "cursor-pointer" : ""
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="relative z-10 p-6">
        <h2 className="text-xl font-bold flex items-center">
          {/* {icon && <span className="mr-2">{icon}</span>} */}

          {title}
        </h2>
        <p className="mt-4 text-3xl">
          {/* {typeof value === "number" ? `$${value.toFixed(2)}` : value} */}
          {icon && (
            <span className="mr-2 text-4xl  text-orange-600">{icon}</span>
          )}
        </p>
      </div>
      <div
        className="absolute inset-0 w-full h-full bg-neutral-900"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)" }}
      ></div>
      <div
        className="absolute inset-0 w-full h-full bg-orange-500"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 60% 100%, 100% 60%)" }}
      ></div>
    </div>
  );
};

const UserBalances: React.FC = () => {
  const router = useRouter();

  const routeToInvest = () => {
    router.push("/dashboard/deposit/plans");
  };
  const routeToTrade = () => {
    router.push("/dashboard/trades");
  };
  const routeToWithdraw = () => {
    router.push("/dashboard/withdraw");
  };

  const routeToViewInterest = () => {
    router.push("/dashboard/deposit/investments");
  };

  const balances = [
    { title: "Trade Now", 
      value: "",
      icon: <FaExchangeAlt />,
      isClickable: true,
      onClick: routeToTrade,
     },
    {
      title: "Invest",
      value: "",
      icon: <FaDollarSign />,
      isClickable: true,
      onClick: routeToInvest,
    },
    {
      title: "Withdraw",
      value: "",
      icon: <FaMoneyBillWave />,
      isClickable: true,
      onClick: routeToWithdraw,
    },
    {
      title: "View Interest",
      value: "Click to View",
      isClickable: true,
      onClick: routeToViewInterest,
      icon: <FaChartLine />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mx-auto justify-center items-center">
      {balances.map((balance, index) => (
        <UserBalanceCard
          key={index}
          title={balance.title}
          value={balance.value}
          isClickable={balance.isClickable}
          onClick={balance.onClick}
          icon={balance.icon}
        />
      ))}
    </div>
  );
};

export default UserBalances;
