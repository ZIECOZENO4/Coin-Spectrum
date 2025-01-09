"use client"

import { motion } from "framer-motion"
import { BarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function TradingOptions() {
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

  return (
    <div className="h-auto bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          className="flex-1 space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            variants={item}
          >
            Trade on the leading multi-asset platform
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400"
            variants={item}
          >
            DISCOVER OUR OPTIONS AND THEIR STATISTICS
          </motion.p>

          <motion.div 
            className="space-y-4"
            variants={container}
          >
            <motion.button
              className="w-full bg-white/10 hover:bg-white/20 text-white p-6 rounded-lg flex items-center gap-4 transition-colors"
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart className="w-8 h-8 text-yellow-400" />
              <span className="text-xl font-semibold">LOW OPTIONS</span>
            </motion.button>

            <motion.button
              className="w-full bg-white/10 hover:bg-white/20 text-white p-6 rounded-lg flex items-center gap-4 transition-colors"
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart className="w-8 h-8 text-yellow-400" />
              <span className="text-xl font-semibold">HIGH OPTIONS</span>
            </motion.button>
          </motion.div>

          <motion.div variants={item}>
            <motion.button 
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-6 text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              START TRADING
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="relative w-full lg:w-1/2 aspect-[3/4]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <Image
            src="/placeholder.svg?height=900&width=600"
            alt="City skyline"
            fill
            className="object-cover rounded-lg"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-between p-8 z-20">
            <motion.p 
              className="text-lg text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              INNOVATION IS WRITTEN IN OUR CODE 👋
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Image
                src="/placeholder.svg?height=60&width=200"
                alt="Trade Options Logo"
                width={200}
                height={60}
                className="object-contain"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

