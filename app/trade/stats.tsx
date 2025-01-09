"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Users, Award, BarChart2, DollarSign } from 'lucide-react'

export default function TradingStats() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  }

  const stats = [
    {
      title: "Total Traders",
      value: "12,547",
      change: "+14%",
      isPositive: true,
      icon: Users,
    },
    {
      title: "Successful Claims",
      value: "8,932",
      change: "+23%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Total Losses",
      value: "3,615",
      change: "-8%",
      isPositive: false,
      icon: TrendingDown,
    },
    {
      title: "Average Success Rate",
      value: "71.2%",
      change: "+5%",
      isPositive: true,
      icon: BarChart2,
    },
    {
      title: "Total Trading Volume",
      value: "$847M",
      change: "+31%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Top Performer ROI",
      value: "312%",
      change: "+127%",
      isPositive: true,
      icon: Award,
    },
  ]

  return (
    <div className="h-auto bg-black text-white py-16 px-4">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className="text-center space-y-4"
          variants={item}
        >
          <h2 className="text-3xl md:text-4xl text-yellow-500 font-bold">
            Coin Spectrum Trading Statistics
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real-time statistics from our trading platform showing the performance of our traders
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors"
              variants={item}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <div className={`flex items-center space-x-1 ${
                    stat.isPositive ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {stat.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <motion.div
                  className="p-3 bg-white/10 rounded-lg"
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <stat.icon className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 text-center"
          variants={item}
        >
          <p className="text-sm text-gray-400">
            * Statistics are updated every 24 hours
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

