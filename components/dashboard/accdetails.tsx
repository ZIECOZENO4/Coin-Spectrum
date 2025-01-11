"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import ReferralCard from "./referral"
import LoginActivities from "./activity"

const statsData = [
  { label: "Active Deposits", value: "$0.00" },
  { label: "Total Trades", value: "$0.00" },
  { label: "Total Deposits", value: "$0.00" },
  { label: "Total Withdrawals", value: "$0.00" },
]

const cardData = [
  { label: "Total Commission", value: "$0" },
  { label: "Total Referrals", value: "0" },
  { label: "Active Referrals", value: "0" },
]

export default function StatsDashboard() {
  return (
    <div className="min-h-screen bg-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto space-y-6"
      >
        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2 bg-slate-800 rounded-lg p-2 md:p-4"
            >
              <motion.h3 
                className="text-yellow-400 text-sm"
                whileHover={{ scale: 1.05 }}
              >
                {stat.label}
              </motion.h3>
              <motion.p 
                className="text-white text-2xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  delay: index * 0.2,
                  stiffness: 200
                }}
              >
                {stat.value}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Card Stats */}
        {cardData.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + (index * 0.2) }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Card className="p-6 bg-slate-200 hover:bg-yellow-100 transition-colors duration-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.2) }}
                className="space-y-2"
              >
                <motion.h3 
                  className="text-black text-lg font-medium"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring" }}
                >
                  {card.label}
                </motion.h3>
                <motion.p 
                  className="text-3xl font-bold text-black"
                  whileHover={{ 
                    scale: 1.1,
                    color: "#FCD34D",
                    transition: { duration: 0.2 }
                  }}
                >
                  {card.value}
                </motion.p>
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </Card>
          </motion.div>
        ))}
        <ReferralCard />
        <LoginActivities />
      </motion.div>
    </div>
  )
}

