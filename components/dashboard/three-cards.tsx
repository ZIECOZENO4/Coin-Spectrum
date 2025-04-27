
"use client";
import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { formatCurrency } from "@/lib/formatCurrency";
import AnimatedWelcome from "./username";
import { motion } from "framer-motion"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { FaMoneyBillTransfer, FaMoneyBillTrendUp } from "react-icons/fa6"
import KycStatus from "./kyc-status";
import TradingViewWidget2 from "@/app/(user)/dashboard/TradingViewWidget2";
import { useUserBalance } from "@/hook/useUserBalance";


const chartdata = Array.from({ length: 50 }, (_, i) => ({
  value: Math.random() * 100 + 50
}))

const KycErrorFallback = ({ error, resetErrorBoundary }: any) => (
  <span className="text-red-500">
    Error loading KYC status: {error.message}.{" "}
    <button 
      onClick={resetErrorBoundary}
      className="underline hover:text-red-700"
    >
      Retry
    </button>
  </span>
);


export const InvestmentDashboard: React.FC<{
  userId: string;
  runUntimed?: boolean;
}> = ({ userId }) => {
  const router = useRouter()
  const { data: balance, isLoading, error } = useUserBalance();


  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 0.5 }
    }
  }

  useEffect(() => {
    if (isLoading) {
    } else if (error) {
      console.error('Error fetching balance:', error);
    } else {
    }
  }, [balance, isLoading, error]);

  return (
    <div className="w-full bg-black align-middle gap-4 space-y-4">
        <div className="p-2 md:p-4">
      <AnimatedWelcome />
      </div>
        <div className="flex md:flex-row flex-col p-2 md:p-6 gap-6 justify-center align-middle ">
        <div className="flex items-center justify-center h-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full "
      >
        <Card className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 border-gray-800">
          <div className="relative z-10 p-6 space-y-6">
            {/* KYC Status */}
            <motion.div
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2 }}
>
  <ErrorBoundary
    FallbackComponent={KycErrorFallback}
    onReset={() => {
      // Reset the state or reload component
      window.location.reload();
    }}
  >
    <div className="text-gray-400 flex flex-row gap-2 md:gap-4">
      Your KYC status is:{" "}
      <span className="">
        <KycStatus />
      </span>
    </div>
  </ErrorBoundary>
</motion.div>

            {/* Balance Section */}
            <div className="space-y-2">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400"
              >
                Total Balance (USD)
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-4xl font-bold text-white"
              >
       {formatCurrency(balance || 0)}
              </motion.div>
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-4 items-center justify-center">
      <motion.button 
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => router.push('/dashboard/makedeposit')}
        className="inline-flex items-center gap-3 px-5 py-3 font-semibold text-black rounded-full whitespace-nowrap overflow-hidden transition-colors duration-300 bg-yellow-400 hover:bg-yellow-500 cursor-pointer shadow-lg"
      >
        <span className="relative flex-shrink-0 w-[25px] h-[25px] bg-white rounded-full grid place-items-center overflow-hidden text-yellow-400 group-hover:text-yellow-500">
          <FaMoneyBillTrendUp 
            className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
          />
          <FaMoneyBillTrendUp 
            className="w-4 h-4 absolute -translate-x-[150%] translate-y-[150%] transition-transform duration-300 ease-in-out delay-100 group-hover:translate-x-0 group-hover:translate-y-0"
          />
        </span>
        Deposit
      </motion.button>

      <motion.button 
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => router.push('/dashboard/withdraw')}
        className="inline-flex items-center gap-3 px-5 py-3 font-semibold text-white rounded-full whitespace-nowrap overflow-hidden transition-colors duration-300 bg-black hover:bg-gray-800 cursor-pointer shadow-lg"
      >
        <span className="relative flex-shrink-0 w-[25px] h-[25px] bg-white rounded-full grid place-items-center overflow-hidden text-black group-hover:text-gray-800">
          <FaMoneyBillTransfer 
            className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
          />
          <FaMoneyBillTransfer 
            className="w-4 h-4 absolute -translate-x-[150%] translate-y-[150%] transition-transform duration-300 ease-in-out delay-100 group-hover:translate-x-0 group-hover:translate-y-0"
          />
        </span>
        Withdrawal
      </motion.button>
    </div>

          </div>

          {/* Background Chart */}
          <div className="absolute inset-0 opacity-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartdata}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#60A5FA"
                  fill="url(#chartGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
    
        </div>
        <div className="hidden md:flex md:flex-col md:w-full md:h-auto md:py-4">
          <TradingViewWidget2 />
        </div>
    </div>
  );
};
