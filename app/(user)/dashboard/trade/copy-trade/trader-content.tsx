"use client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import TraderCard from "./trader-card";

interface Trader {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
  minCapital: number;
  percentageProfit: number;
  totalProfit: number;
  rating: number;
  isPro?: boolean;
}

// Hook to fetch traders
const useTraders = () => {
  return useQuery<Trader[]>({
    queryKey: ['traders'],
    queryFn: async () => {
      console.log("Fetching traders...");
      const response = await fetch('/api/traders');
      if (!response.ok) {
        throw new Error('Failed to fetch traders');
      }
      const data = await response.json();
      console.log("Traders fetched successfully:", data);
      return data.traders;
    }
  });
};

export default function TradingExperts() {
  const { data: traders, isLoading, isError, error } = useTraders();

  if (isLoading) {
    return (
      <div className="h-auto bg-black p-8">
        <div className="text-white text-center">Loading traders...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-auto bg-black p-8">
        <div className="text-red-500 text-center">
          Error loading traders: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto bg-black p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl font-bold text-white text-center mb-2"
      >
        Top Trading Experts
      </motion.h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {traders?.map((trader) => (
          <motion.div
            key={trader.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TraderCard {...trader} id={trader.id} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
