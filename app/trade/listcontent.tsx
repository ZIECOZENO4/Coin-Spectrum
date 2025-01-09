"use client"

import { motion } from "framer-motion"
import { MessageSquare, Boxes, Coffee, Heart } from 'lucide-react'

export default function FeaturesGrid() {
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

  const features = [
    {
      icon: MessageSquare,
      title: "Customer support 24/7",
      description:
        "Our support team is available to answer to all Questions regarding the Gain Capital Limited investors portal, account issues and casual inquires.",
    },
    {
      icon: Boxes,
      title: "Trade over 15 Markets",
      description:
        "Trade over 15 global CFD markets including Forex, Cryptocurrencies, Indicies, Commodities, Share CFDs and ETFs.",
    },
    {
      icon: Coffee,
      title: "Regulated broker",
      description:
        "We are also regulated by the world's biggest supervision authorities including the Financial Conduct Authority.",
    },
    {
      icon: Heart,
      title: "No requotes",
      description:
        "Our advanced trading technology allows you to avoid requotes and trade with a full trust that your trade will run without losses.",
    },
  ]

  return (
    <div className="bg-black h-auto py-4 md:py-8 px-4">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="text-center p-6 group"
            variants={item}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-yellow-400 text-black"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {<feature.icon className="w-8 h-8" />}
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

