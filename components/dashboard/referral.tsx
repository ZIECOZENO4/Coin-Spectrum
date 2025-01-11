"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Check, Copy } from 'lucide-react'

export default function ReferralCard() {
  const [copied, setCopied] = useState(false)
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([])
  const referralLink = "https://gaincapitallimited.co/?ref="

  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
    }))
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 1000)
  }

  const handleCopy = async (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    createParticles(rect.x + rect.width / 2, rect.y + rect.height / 2)
    
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="h-auto bg-slate-900 flex items-center p-4 rounded-lg justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-slate-900 space-y-4">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-semibold"
          >
            Your Referral Link
          </motion.h2>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="p-3 bg-gray-800 rounded-lg border border-gray-200 font-mono text-sm break-all">
              {referralLink}
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="w-full relative bg-yellow-500 text-black py-6 rounded-lg font-medium 
                     transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 
                     focus:ring-yellow-500 focus:ring-offset-2"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Copied!
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy Link
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Particle Effects */}
          <AnimatePresence>
            {particles.map((particle, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: particle.x,
                  y: particle.y,
                  scale: 0,
                  opacity: 1 
                }}
                animate={{
                  x: particle.x + (Math.random() - 0.5) * 200,
                  y: particle.y - 200,
                  scale: 1,
                  opacity: 0
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed w-2 h-2 bg-yellow-500 rounded-full pointer-events-none"
              />
            ))}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}

