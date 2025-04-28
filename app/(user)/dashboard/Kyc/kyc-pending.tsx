// app/(user)/dashboard/Kyc/kyc-pending.tsx
'use client';

import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistance } from 'date-fns';

interface KYCPendingProps {
  submissionDate?: string;
}

export default function KYCPending({ submissionDate }: KYCPendingProps) {
  const router = useRouter();

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
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="mx-auto mb-4 w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center"
          >
            <Clock className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">
            Verification in Progress
          </h2>
          <p className="text-slate-300 mb-4">
            Your KYC verification is being reviewed by our team. This usually takes 24-48 hours.
          </p>
          {submissionDate && (
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-400 text-sm">
                Submitted: {formatDistance(new Date(submissionDate), new Date(), { addSuffix: true })}
              </p>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-4 bg-slate-800/50 rounded-lg"
          >
            <p className="text-slate-400 text-sm">
              We'll notify you once your verification is complete. You can continue exploring the platform in the meantime.
            </p>
          </motion.div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/dashboard')}
          className="mt-6 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group hover:shadow-yellow-500/20 hover:shadow-xl"
        >
          Return to Dashboard
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
}