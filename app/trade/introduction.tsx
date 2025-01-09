"use client"

import { motion } from "framer-motion"

export default function AnimatedHero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
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
    <div className="h-auto mt-4 md:mt-8 flex items-center justify-center bg-black text-white px-4">
      <motion.div
        className="max-w-5xl mx-auto text-center space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1 
          className="text-3xl md:text-4xl  text-yellow-500 font-bold tracking-tight"
          variants={item}
        >
          Trade with highly rated COIN SPECTRUM traders.
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
          variants={item}
        >
          {"We're a top provider of CFDs and mirror trading operations in over 14 countries using automated trading computers for market decisions and instant market executions to give out profitable trade results."}
        </motion.p>
        <motion.p 
          className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
          variants={item}
        >
          {"We give investors leveraged access to over 15 financial markets through our award-winning portal."}
        </motion.p>
      </motion.div>
    </div>
  )
}

