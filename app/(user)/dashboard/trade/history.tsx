"use client"

import { motion } from "framer-motion"
import { ArrowUpIcon } from 'lucide-react'

interface Trade {
  id: string
  pair: string
  amount: number
  timestamp: string
  status: "Buy" | "Expired"
  leverage?: string
  winPercentage?: string
}

const trades: Trade[] = [
  {
    id: "1",
    pair: "EURJPY",
    amount: 50,
    timestamp: "Sat, Aug 10, 2024 8:08 PM",
    status: "Buy",
    leverage: "1:20"
  },
  {
    id: "2",
    pair: "EURJPY",
    amount: 120,
    timestamp: "Thu, Jul 25, 2024 2:35 AM",
    status: "Expired",
    winPercentage: "+20%"
  },
  {
    id: "3",
    pair: "EURJPY",
    amount: 600,
    timestamp: "Thu, Jul 25, 2024 2:34 AM",
    status: "Buy",
    leverage: "1:20"
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function LatestTrades() {
  return (
    <div className="h-auto bg-black p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2"
      >
        <h1 className="text-xl md:text-2xl font-bold text-yellow-400 tracking-tight">
          Latest Trades
        </h1>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        {trades.map((trade) => (
          <motion.div
            key={trade.id}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900 rounded-lg p-2 border border-yellow-400/20 shadow-lg hover:shadow-yellow-400/10 transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ArrowUpIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-md font-semibold text-yellow-400">
                    {trade.pair}
                  </span>
                </div>
                <motion.p 
                  className="text-zinc-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {trade.timestamp}
                </motion.p>
              </div>

              <div className="text-right space-y-2">
                <motion.div
                  className="text-xl font-bold text-white"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  {trade.amount} USD
                </motion.div>
                <div className="flex items-center justify-end space-x-2">
                  <motion.span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      trade.status === "Buy"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-zinc-700/50 text-zinc-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {trade.status}
                  </motion.span>
                  {trade.leverage && (
                    <span className="text-zinc-500 text-sm">
                      Leverage:{trade.leverage}
                    </span>
                  )}
                  {trade.winPercentage && (
                    <motion.span
                      className="text-yellow-400 font-semibold"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        transition: { 
                          repeat: Infinity, 
                          duration: 2 
                        }
                      }}
                    >
                      {trade.winPercentage}
                    </motion.span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

