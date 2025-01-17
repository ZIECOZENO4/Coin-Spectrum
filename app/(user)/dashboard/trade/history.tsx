"use client"

import { motion } from "framer-motion"
import { ArrowUpIcon, Signal, Copy, TrendingUp } from 'lucide-react'
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

interface Trade {
  id: string
  type: 'TRADE' | 'SIGNAL' | 'COPY'
  pair: string
  amount: number
  timestamp: string
  status: string
  leverage?: string
  profit?: number
  expiresAt?: string
}

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
  const { data: trades, isLoading, error } = useQuery({
    queryKey: ['trading-history'],
    queryFn: async () => {
      const response = await fetch('/api/trading-history')
      if (!response.ok) throw new Error('Failed to fetch trading history')
      return response.json() as Promise<Trade[]>
    }
  })

  if (isLoading) {
    return <div className="h-auto bg-black p-8">Loading...</div>
  }

  if (error) {
    return <div className="h-auto bg-black p-8">Error loading trades</div>
  }

  const getTradeIcon = (type: string) => {
    switch (type) {
      case 'SIGNAL':
        return <Signal className="h-5 w-5 text-yellow-400" />
      case 'COPY':
        return <Copy className="h-5 w-5 text-yellow-400" />
      default:
        return <TrendingUp className="h-5 w-5 text-yellow-400" />
    }
  }

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
        {trades?.map((trade) => (
          <motion.div
            key={trade.id}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900 rounded-lg p-2 border border-yellow-400/20 shadow-lg hover:shadow-yellow-400/10 transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {getTradeIcon(trade.type)}
                  <span className="text-md font-semibold text-yellow-400">
                    {trade.pair}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {trade.type}
                  </span>
                </div>
                <motion.p 
                  className="text-zinc-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {format(new Date(trade.timestamp), 'PPp')}
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
                      trade.status === "active"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-zinc-700/50 text-zinc-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {trade.status}
                  </motion.span>
                  {trade.leverage && (
                    <span className="text-zinc-500 text-sm">
                      Leverage: {trade.leverage}
                    </span>
                  )}
                  {trade.profit && (
                    <motion.span
                      className={`font-semibold ${
                        trade.profit > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {trade.profit > 0 ? '+' : ''}{trade.profit}%
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
