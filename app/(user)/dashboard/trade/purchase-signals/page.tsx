"use client";
import { motion } from "framer-motion";
import SignalCard from "./signal-card";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Define the Signal type
interface Signal {
  id: string;
  name: string;
  price: number;
  percentage: number;
  expiry: string;
  risk: "Low" | "Medium" | "High";
  description: string;
}

// Custom hook to fetch signals with proper typing
const useSignals = () => {
  return useQuery<Signal[], Error>({
    queryKey: ['signals'],
    queryFn: async () => {
      console.log("Fetching trading signals...");
      const response = await fetch('/api/signals');
      if (!response.ok) {
        throw new Error('Failed to fetch signals');
      }
      const data = await response.json();
      console.log("Signals fetched successfully:", data);
      return data.signals;
    }
  });
};

export default function TradingSignals(): JSX.Element {
  const { data: signals, isLoading, isError } = useSignals();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white"
        >
          Loading signals...
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500"
        >
          Failed to load signals
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-bold text-white"
          >
            Premium Trading Signals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-2xl mx-auto"
          >
            Access exclusive trading signals with detailed analysis and high probability setups
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals?.map((signal, index) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SignalCard {...signal} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
