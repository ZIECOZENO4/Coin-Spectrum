"use client"

import { motion } from "framer-motion"
import TraderCard from "./trader-card"

const traders = [
  {
    name: "Jarvis B. Buckley",
    image: "/placeholder.svg?height=200&width=200",
    followers: 450000,
    minCapital: 20000,
    percentageProfit: 96,
    totalProfit: 1280000,
    rating: 5,
    isPro: true
  },
  {
    name: "Sarah Anderson",
    image: "/placeholder.svg?height=200&width=200",
    followers: 320000,
    minCapital: 15000,
    percentageProfit: 88,
    totalProfit: 950000,
    rating: 4,
    isPro: true
  },
  {
    name: "Michael Chen",
    image: "/placeholder.svg?height=200&width=200",
    followers: 280000,
    minCapital: 10000,
    percentageProfit: 82,
    totalProfit: 720000,
    rating: 4
  }
]

export default function TradingExperts() {
  return (
    <div className="h-auto bg-black p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl font-bold text-white text-center mb-2"
      >
        Top Trading Experts
      </motion.h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {traders.map((trader, index) => (
          <motion.div
            key={trader.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <TraderCard {...trader} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

