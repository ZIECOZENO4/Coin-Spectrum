// app/(user)/dashboard/Kyc/kyc-approved.tsx
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight } from 'lucide-react';

export default function KYCApproved() {
  const router = useRouter();

  useEffect(() => {
    // Trigger confetti on component mount
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#16a34a', '#4ade80'],
    });

    // Additional burst after a small delay
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 500);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#1e293b] p-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 12 }}
        className="relative bg-black/70 border border-slate-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center backdrop-blur-lg"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Identity Verified! 🎉
          </h2>
          <p className="text-slate-300 mb-4">
            Your KYC verification has been approved. You now have full access to all trading features.
          </p>
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-green-400 text-sm">
              Status: <span className="font-semibold">Verified</span>
            </p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#22c55e" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/dashboard')}
          className="mt-6 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group hover:shadow-green-500/20 hover:shadow-xl"
        >
          Return to Dashboard
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
}