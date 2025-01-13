"use client"

import { motion } from "framer-motion"
import SignalCard from "./signal-card"

const signals = [
  {
    id: "SIG-001",
    name: "EURUSD Long",
    price: 150,
    percentage: 5,
    expiry: "24h",
    risk: "Low",
    description: "Strong bullish momentum detected on EURUSD with multiple technical indicators confirming upward trend."
  },
  {
    id: "SIG-002",
    name: "GBPJPY Short",
    price: 180,
    percentage: 7,
    expiry: "12h",
    risk: "Medium",
    description: "Technical breakdown expected with resistance level breach imminent."
  },
  {
    id: "SIG-003",
    name: "BTCUSD Long",
    price: 250,
    percentage: 12,
    expiry: "48h",
    risk: "High",
    description: "Major support level holding with increasing volume indicating potential breakout."
  },
  {
    id: "SIG-004",
    name: "XAUUSD Short",
    price: 200,
    percentage: 6,
    expiry: "36h",
    risk: "Medium",
    description: "Gold showing weakness at key resistance with bearish divergence on RSI."
  },
  {
    id: "SIG-005",
    name: "USDJPY Long",
    price: 160,
    percentage: 4,
    expiry: "24h",
    risk: "Low",
    description: "Clear uptrend continuation pattern forming with strong fundamental backing."
  }
] as const

export default function TradingSignals() {
  return (
    <div className="min-h-screen bg-black p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-bold text-white"
          >
            Premium Trading Signals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-2xl mx-auto"
          >
            Access exclusive trading signals with detailed analysis and high probability setups
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal, index) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SignalCard {...signal} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

