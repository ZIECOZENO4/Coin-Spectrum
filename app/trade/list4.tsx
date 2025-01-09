"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import NewsContent from "./news"

export default function TradedAssets() {
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
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  }

  const lineAnimation = {
    hidden: { scaleX: 0 },
    show: {
      scaleX: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <motion.div
            className="flex-1 space-y-12"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
              variants={item}
            >
              Our Most Traded Assets
            </motion.h1>

            <motion.div 
              className="space-y-12"
              variants={container}
            >
              <motion.div variants={item} className="space-y-4">
                <h2 className="text-2xl font-semibold text-yellow-400">
                  On Forex
                </h2>
                <motion.div
                  className="h-px bg-white/20"
                  variants={lineAnimation}
                  style={{ originX: 0 }}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  {["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD"].map((pair) => (
                    <motion.div
                      key={pair}
                      className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {pair}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-4">
                <h2 className="text-2xl font-semibold text-yellow-400">
                  On Crypto
                </h2>
                <motion.div
                  className="h-px bg-white/20"
                  variants={lineAnimation}
                  style={{ originX: 0 }}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  {["BTC", "USDT", "ETH", "SOL", "NOT", "USDC"].map((asset) => (
                    <motion.div
                      key={asset}
                      className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {asset}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="relative aspect-square rounded-lg overflow-hidden">
             <NewsContent />
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

