

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


interface TraderProps {
  name: string
  image: string
  followers: number
  minCapital: number
  percentageProfit: number
  totalProfit: number
  rating: number
  isPro?: boolean
}
// Hook to fetch traders
const useTraders = () => {
  return useQuery({
    queryKey: ["traders"],
    queryFn: async () => {
      const response = await fetch("/api/traders");
      if (!response.ok) {
        throw new Error("Failed to fetch traders");
      }
      return response.json();
    }
  });
};

// Hook for copy trading
const useCopyTrade = () => {
  return useMutation({
    mutationFn: async ({ traderId, amount }: { traderId: string; amount: number }) => {
      const response = await fetch("/api/copy-trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traderId, amount })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to copy trade");
      }
      
      return response.json();
    }
  });
};

export default function TraderCard({ id, ...props }: TraderProps & { id: string }) {
  const { 
    name,
    image,
    followers,
    minCapital,
    percentageProfit,
    totalProfit,
    rating,
    isPro = false 
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(props.minCapital);
  const copyTradeMutation = useCopyTrade();

  const handleCopyTrade = async () => {
    if (amount < props.minCapital) {
      toast.error(`Minimum capital required is $${props.minCapital.toLocaleString()}`);
      return;
    }

    try {
      await copyTradeMutation.mutateAsync({
        traderId: id,
        amount
      });
      
      toast.success("Successfully copied trader");
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Original JSX remains the same until the Dialog content
  return (
    <>
          <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-zinc-900 rounded-xl overflow-hidden border border-yellow-400/20 relative"
      >
        {isPro && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-4 z-10"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm"
            >
              PRO
            </motion.div>
          </motion.div>
        )}

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400"
            >
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-xl font-semibold text-white"
            >
              {name}
            </motion.h3>
          </div>

          <div className="space-y-4 text-center">
            <div>
              <div className="text-zinc-400 text-sm">Followers</div>
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                {followers.toLocaleString()}
              </motion.div>
            </div>

            <div>
              <div className="text-zinc-400 text-sm">Minimum Start Up Capital</div>
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                ${minCapital.toLocaleString()}
              </motion.div>
            </div>

            <div className="flex justify-between px-4">
              <div>
                <div className="text-zinc-400 text-sm">Percentage Profit</div>
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-xl font-bold text-yellow-400"
                >
                  {percentageProfit}%
                </motion.div>
              </div>
              <div>
                <div className="text-zinc-400 text-sm">Total Profit</div>
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-xl font-bold text-yellow-400"
                >
                  ${totalProfit.toLocaleString()}
                </motion.div>
              </div>
            </div>

            <div>
              <div className="text-zinc-400 text-sm mb-2">Rating</div>
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i < rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(true)}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors"
          >
            Copy Expert
          </motion.button>
        </div>
      </motion.div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-zinc-900 border border-yellow-400/20">
          <DialogHeader>
            <DialogTitle className="text-white">Copy Trading Confirmation</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <Input
              type="number"
              min={props.minCapital}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="Enter investment amount"
              className="bg-zinc-800 border-yellow-400/20 text-white"
            />
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">Minimum Capital Required</span>
                <span className="text-yellow-400 font-bold">
                  ${props.minCapital.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Success Rate</span>
                <span className="text-yellow-400 font-bold">{props.percentageProfit}%</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg"
              onClick={handleCopyTrade}
              disabled={copyTradeMutation.isPending}
            >
              {copyTradeMutation.isPending ? "Processing..." : "Confirm Copy Trading"}
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
