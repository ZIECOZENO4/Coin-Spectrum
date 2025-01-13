"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, TrendingUp, DollarSign, Clock, Gauge } from 'lucide-react'
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample chart data
const chartData = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  value: Math.sin(i * 0.5) * 10 + 150
}))

export default function TradingInterface() {
  const [amount, setAmount] = useState("0.00")
  const [selectedPair, setSelectedPair] = useState("EURJPY")

  return (
    <div className="h-auto bg-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
    
        {/* Trading Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-yellow-400">Trading Assets</h2>
          
          {/* Asset Selector */}
          <Select defaultValue={selectedPair} onValueChange={setSelectedPair}>
            <SelectTrigger className="w-full bg-zinc-900 border-yellow-400/20 text-white">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-yellow-400/20">
              <SelectItem value="EURJPY">EURJPY</SelectItem>
              <SelectItem value="EURUSD">EURUSD</SelectItem>
              <SelectItem value="GBPUSD">GBPUSD</SelectItem>
            </SelectContent>
          </Select>

          {/* Investment Amount */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex bg-zinc-900 border border-yellow-400/20 rounded-lg overflow-hidden"
            >
              <div className="bg-zinc-800 px-4 py-3 text-white font-medium">
                USD
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 text-white focus:outline-none"
                placeholder="Invest Amount"
              />
            </motion.div>
          </div>

          {/* Leverage Selector */}
          <Select defaultValue="1:20">
            <SelectTrigger className="w-full bg-zinc-900 border-yellow-400/20 text-white">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-yellow-400" />
                <span>Leverage</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-yellow-400/20">
              <SelectItem value="1:10">1:10</SelectItem>
              <SelectItem value="1:20">1:20</SelectItem>
              <SelectItem value="1:50">1:50</SelectItem>
            </SelectContent>
          </Select>

          {/* Expiration Selector */}
          <Select defaultValue="5m">
            <SelectTrigger className="w-full bg-zinc-900 border-yellow-400/20 text-white">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span>Expiration</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-yellow-400/20">
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 text-lg"
                onClick={() => console.log("BUY")}
              >
                BUY
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-6 text-lg"
                onClick={() => console.log("SELL")}
              >
                SELL
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

