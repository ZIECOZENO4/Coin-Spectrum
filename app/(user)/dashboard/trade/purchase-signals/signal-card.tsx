"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Key, TrendingUp, Percent, Clock, AlertTriangle } from 'lucide-react'
import { usePurchaseSignal } from "@/hook/usePurchaseSignals"

interface SignalProps {
  id: string
  name: string
  price: number
  percentage: number
  expiry: string
  risk: "Low" | "Medium" | "High"
  description: string
}

export default function SignalCard({ id, name, price, percentage, expiry, risk, description }: SignalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const purchaseSignal = usePurchaseSignal();

  const handlePurchase = async () => {
    try {
      await purchaseSignal.mutateAsync({ signalId: id });
      setIsOpen(false);
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        className="bg-zinc-900 rounded-xl overflow-hidden border border-yellow-400/20"
      >
        <div className="p-6 space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-semibold text-white">{name}</span>
            </div>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                transition: { duration: 2, repeat: Infinity }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                risk === "Low" ? "bg-green-500/20 text-green-400" :
                risk === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              }`}
            >
              {risk} Risk
            </motion.div>
          </motion.div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Signal Price</span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-white"
              >
                 {price} USD
              </motion.span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Percentage</span>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-1 text-yellow-400"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold">{percentage}%</span>
              </motion.div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Expiry (hrs)</span>
              <span className="text-white">{expiry}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(true)}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors mt-4"
          >
            Subscribe Now
          </motion.button>
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-zinc-900 border border-yellow-400/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Signal Purchase Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Signal ID</span>
                <span className="text-white font-mono">{id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Price</span>
                <span className="text-yellow-400 font-bold">$ {price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Expected Return</span>
                <span className="text-yellow-400 font-bold">{percentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Valid Until</span>
                <span className="text-white">{expiry}</span>
              </div>
            </div>

            <div className="bg-zinc-800 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Signal Description</h4>
              <p className="text-zinc-400 text-sm">****************************</p>
            </div>

            <div className="bg-yellow-400/10 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-300">
                  Please ensure you understand the risks involved before purchasing this trading signal.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                Cancel
              </Button>
              <Button
    onClick={handlePurchase}
    disabled={purchaseSignal.isPending}
    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
  >
    {purchaseSignal.isPending ? "Processing..." : "Confirm Purchase"}
  </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

