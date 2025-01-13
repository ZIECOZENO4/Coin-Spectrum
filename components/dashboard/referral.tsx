"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useCopyToClipboard } from "@uidotdev/usehooks"
import { useReferralData } from "@/lib/tenstack-hooks/useRefferals"
import { FaCheck, FaCopy } from "react-icons/fa"

interface ReferralData {
  referralLink: string
  referrerId: string
  referredUserId: string
}

export default function ReferralCard() {
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([])
  const { data: referralData } = useReferralData<ReferralData>()
  const [copiedText, copyToClipboard] = useCopyToClipboard()

  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
    }))
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 1000)
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
            className="text-xl font-semibold text-white"
          >
            Your Referral Link
          </motion.h2>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 font-mono text-sm break-all text-white">
              {referralData?.referralLink}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.button
              disabled={!!copiedText}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-full py-4 rounded-lg font-medium 
                flex items-center justify-center gap-2
                transition-colors duration-300
                ${copiedText 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-500 hover:bg-yellow-600 text-black'}
                focus:outline-none focus:ring-2 
                focus:ring-yellow-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              onClick={async () => {
                if (referralData?.referralLink) {
                  await copyToClipboard(referralData.referralLink)
                  createParticles(window.innerWidth / 2, window.innerHeight / 2)
                }
              }}
            >
              {copiedText ? (
                <>
                  <FaCheck className="text-lg" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <FaCopy className="text-lg" />
                  <span>Copy Link</span>
                </>
              )}
            </motion.button>
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}
