"use client"

import { motion } from "framer-motion"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react'

// Sample data for the chart
const data = Array.from({ length: 50 }, (_, i) => ({
  value: Math.random() * 100 + 50
}))

export default function BalanceCard() {
  return (
    <div className="flex items-center justify-center h-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 border-gray-800">
          <div className="relative z-10 p-6 space-y-6">
            {/* KYC Status */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400"
            >
              Your KYC status is: <span className="text-yellow-400">Pending</span>
            </motion.div>

            {/* Balance Section */}
            <div className="space-y-2">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400"
              >
                Total Balance
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-4xl font-bold text-white"
              >
                $0
              </motion.div>
            </div>

            {/* Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              <Button
                variant="secondary"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold"
              >
                <ArrowUpToLine className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
              <Button
                variant="secondary"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold"
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Deposit
              </Button>
            </motion.div>
          </div>

          {/* Background Chart */}
          <div className="absolute inset-0 opacity-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
  )
}

