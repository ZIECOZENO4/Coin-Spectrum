// import React from "react";
// import DashboardCard from "./card";

// interface BalanceInfo {
//   label: string;
//   balance: string;
// }

// const balanceData: BalanceInfo[] = [
//   { label: "Available Balance", balance: "$1234.56" },
//   { label: "Profits", balance: "$567.89" },
//   { label: "Total Withdrawal", balance: "$345.67" },
// ];

// const BalanceDashboard: React.FC = () => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-32 p-4 mx-auto ">
//       {balanceData.map((item, index) => (
//         <DashboardCard key={index} label={item.label} balance={item.balance} />
//       ))}
//     </div>
//   );
// };

// export default BalanceDashboard;
"use client";
import React from "react";
import DashboardCard from "./card";
import useProcessInvestments from "@/lib/tenstack-hooks/cachedUseProcessInvestments";
import { formatCurrency } from "@/lib/formatCurrency";
import BalanceCard from "./card1";
import AnimatedWelcome from "./username";

export const InvestmentDashboard: React.FC<{
  userId: string;
  runUntimed?: boolean;
}> = ({ userId, runUntimed }) => {
  const { data, isLoading, error } = useProcessInvestments(userId, runUntimed);

  return (
    // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-32 p-4 mx-auto">
    //   <DashboardCard
    //     label="Available Balance"
    //     balance={`${formatCurrency(data?.userBalance || 0)}`}
    //   />
    //   <DashboardCard
    //     label="Withdrawable Balance"
    //     balance={`${formatCurrency(data?.withdrawableBalance || 0)}`}
    //   />
    //   <DashboardCard
    //     label="Profits"
    //     balance={`${formatCurrency(data?.totalProfit || 0)}`}
    //   />
    //   <DashboardCard
    //     label="Total Withdrawal"
    //     balance={`${formatCurrency(data?.totalWithdrawal || 0)}`}
    //   />
    // </div>
    <div className="div">
        <div className="relative w-[95vw]   xs:w-72 sm:w-full md:w-full h-auto  bg-orange-500 rounded-lg overflow-hidden shadow-lg">
      <div
        className="absolute inset-0 bg-orange-600"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%)" }}
      ></div>
      <div className="p-2 md:p-4">
      <AnimatedWelcome />
      </div>
        <div className="flex md:flex-row flex-col p-2 md:p-6 gap-6 justify-between ">
        <BalanceCard />
        <BalanceCard />
        </div>
      <div
        className="absolute bottom-0 left-0 right-0 bg-black text-white px-4 py-2"
        style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
      >
      
      </div>
    
    </div>
    </div>
  );
};
