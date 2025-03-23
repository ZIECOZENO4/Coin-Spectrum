// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Clock, Gauge } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { toast } from "sonner"
// import { useCreateTrade } from "@/lib/tenstack-hooks/useTradeMutation"

// interface TradingInterfaceProps {
//   selectedPair: string;
//   onSymbolChange: (symbol: string) => void;
// }
// export default function TradingInterface({ selectedPair, onSymbolChange }: TradingInterfaceProps) {
//   const [amount, setAmount] = useState("0.00");
//   const [leverage, setLeverage] = useState("1:20");
//   const [expiry, setExpiry] = useState("5m");
  
//   const createTrade = useCreateTrade();


//   const handleTrade = async (type: 'BUY' | 'SELL') => {
//     if (!amount || parseFloat(amount) <= 0) {
//       toast.error('Please enter a valid amount')
//       return
//     }
  
//     const tradeData = {
//       symbol: selectedPair,
//       type,
//       amount: parseFloat(amount),
//       leverage,
//       expiry
//     };
    
//     console.log('Trade Data:', tradeData);
  
//     try {
//       await createTrade.mutateAsync(tradeData);
//       toast.success('Trade placed successfully')
//       setAmount("0.00")
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to place trade')
//     }
//   }

  
//   return (
//     <div className="h-auto bg-black p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-4xl mx-auto space-y-6"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="space-y-4"
//         >
//           <h2 className="text-2xl font-bold text-yellow-400">Trading Assets</h2>
          
//           <Select value={selectedPair} onValueChange={onSymbolChange} >
//             <SelectTrigger className="w-full bg-zinc-900 border-yellow-400/20 text-white">
//               <SelectValue placeholder="Select asset" />
//             </SelectTrigger>
//             <SelectContent className="bg-zinc-900 border-yellow-400/20">
//               <SelectItem value="EUR/USD">EUR/USD</SelectItem>
//               <SelectItem value="GBP/USD">GBP/USD</SelectItem>
//               <SelectItem value="USD/JPY">USD/JPY</SelectItem>
//               <SelectItem value="USD/CHF">USD/CHF</SelectItem>
//               <SelectItem value="AUD/USD">AUD/USD</SelectItem>
//               <SelectItem value="USD/CAD">USD/CAD</SelectItem>
//               <SelectItem value="BTC">BTC</SelectItem>
//               <SelectItem value="USDT">USDT</SelectItem>
//               <SelectItem value="ETH">ETH</SelectItem>
//               <SelectItem value="SOL">SOL</SelectItem>
//               <SelectItem value="NOT">NOT</SelectItem>
//               <SelectItem value="USDC">USDC</SelectItem>
//             </SelectContent>
//           </Select>

//           <div className="relative">
//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               className="flex bg-zinc-900 border border-yellow-400/20 rounded-lg overflow-hidden"
//             >
//               <div className="bg-zinc-800 px-4 py-3 text-white font-medium">
//                 USD
//               </div>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="flex-1 bg-transparent px-4 py-3 text-white focus:outline-none"
//                 placeholder="Trade Amount"
//                 min="50"
//               />
//             </motion.div>
//           </div>

//           <Select value={leverage} onValueChange={setLeverage}>
//             <SelectTrigger className="w-full bg-zinc-900 border-yellow-400/20 text-white">
//               <div className="flex items-center gap-2">
//                 <Gauge className="w-4 h-4 text-yellow-400" />
//                 <span>Leverage</span>
//               </div>
//             </SelectTrigger>
//             <SelectContent className="bg-zinc-900 border-yellow-400/20">
//               <SelectItem value="1:10">1:10</SelectItem>
//               <SelectItem value="1:20">1:20</SelectItem>
//               <SelectItem value="1:50">1:50</SelectItem>
//               <SelectItem value="1:100">1:100</SelectItem>
//               <SelectItem value="1:500">1:500</SelectItem>
//               <SelectItem value="1:1000">1:1000</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={expiry} onValueChange={setExpiry}>
//             <SelectTrigger className="w-full bg-zinc-900 border-yellow-400/20 text-white">
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4 text-yellow-400" />
//                 <span>Expiration</span>
//               </div>
//             </SelectTrigger>
//             <SelectContent className="bg-zinc-900 border-yellow-400/20">
//               <SelectItem value="1m">1 Minute</SelectItem>
//               <SelectItem value="5m">5 Minutes</SelectItem>
//               <SelectItem value="15m">15 Minutes</SelectItem>
//               <SelectItem value="30m">30 Minutes</SelectItem>
//               <SelectItem value="1h">1 Hour</SelectItem>
//               <SelectItem value="24h">24 Hour</SelectItem>
//             </SelectContent>
//           </Select>

//           <div className="grid grid-cols-2 gap-4 pt-4">
//             <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//               <Button
//                 className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 text-lg"
//                 onClick={() => handleTrade('BUY')}
//                 disabled={createTrade.isPending}
//               >
//                 {createTrade.isPending ? 'Processing...' : 'BUY'}
//               </Button>
//             </motion.div>
//             <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//               <Button
//                 className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-6 text-lg"
//                 onClick={() => handleTrade('SELL')}
//                 disabled={createTrade.isPending}
//               >
//                 {createTrade.isPending ? 'Processing...' : 'SELL'}
//               </Button>
//             </motion.div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Gauge } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useCreateTrade } from "@/lib/tenstack-hooks/useTradeMutation"

interface TradingInterfaceProps {
  selectedPair: string;
  onSymbolChange: (symbol: string) => void;
}

const leverageOptions: Record<string, string[]> = {
  "EUR/USD": ["1:50", "1:100", "1:200"],
  "GBP/USD": ["1:50", "1:100", "1:200"],
  "USD/JPY": ["1:30", "1:50", "1:100"],
  "USD/CHF": ["1:30", "1:50", "1:100"],
  "AUD/USD": ["1:50", "1:100", "1:200"],
  "USD/CAD": ["1:30", "1:50", "1:100"],
  "BTC": ["1:5", "1:10", "1:20"],
  "ETH": ["1:5", "1:10", "1:20"],
  "SOL": ["1:5", "1:10", "1:20"],
  "NOT": ["1:2", "1:5", "1:10"],
  "USDT": ["1:1"],
  "USDC": ["1:1"],
  default: ["1:10", "1:20", "1:50"]
};

export default function TradingInterface({ selectedPair, onSymbolChange }: TradingInterfaceProps) {
  const [amount, setAmount] = useState("50.00");
  const [leverage, setLeverage] = useState("1:20");
  const [expiry, setExpiry] = useState("5m");
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  
  const createTrade = useCreateTrade();

  useEffect(() => {
    // Reset leverage when pair changes
    const options = leverageOptions[selectedPair] || leverageOptions.default;
    setLeverage(options[0]);
  }, [selectedPair]);

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const tradeData = {
      symbol: selectedPair,
      type,
      amount: parseFloat(amount),
      leverage,
      expiry
    };
    
    try {
      await createTrade.mutateAsync(tradeData);
      toast.success('Trade placed successfully')
      // Reset form values
      setAmount("50.00");
      setLeverage(leverageOptions[selectedPair]?.[0] || "1:20");
      setExpiry("5m");
    } catch (error: any) {
      toast.error(error.message || 'Failed to place trade')
    }
  }

  return (
    <div className="h-auto bg-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-yellow-400">Trading Assets</h2>
          
          <Select value={selectedPair} onValueChange={onSymbolChange}>
            <SelectTrigger className="w-full bg-zinc-900 border-yellow-400/20 text-white">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-yellow-400/20">
              <SelectItem value="EUR/USD">EUR/USD</SelectItem>
              <SelectItem value="GBP/USD">GBP/USD</SelectItem>
              <SelectItem value="USD/JPY">USD/JPY</SelectItem>
              <SelectItem value="USD/CHF">USD/CHF</SelectItem>
              <SelectItem value="AUD/USD">AUD/USD</SelectItem>
              <SelectItem value="USD/CAD">USD/CAD</SelectItem>
              <SelectItem value="BTC">BTC</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="SOL">SOL</SelectItem>
              <SelectItem value="NOT">NOT</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
            </SelectContent>
          </Select>

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
                placeholder="Trade Amount"
                min="50"
                step="0.01"
              />
            </motion.div>
          </div>

          <Select value={leverage} onValueChange={setLeverage}>
            <SelectTrigger className="w-full bg-zinc-900 border-yellow-400/20 text-white">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-yellow-400" />
                <span>Leverage</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-yellow-400/20">
              {(leverageOptions[selectedPair] || leverageOptions.default).map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={expiry} onValueChange={setExpiry}>
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
              <SelectItem value="30m">30 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="24h">24 Hour</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 text-lg"
                onClick={() => {
                  setTradeType('BUY');
                  handleTrade('BUY');
                }}
                disabled={createTrade.isPending}
              >
                {createTrade.isPending && tradeType === 'BUY' ? 'Processing...' : 'BUY'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-6 text-lg"
                onClick={() => {
                  setTradeType('SELL');
                  handleTrade('SELL');
                }}
                disabled={createTrade.isPending}
              >
                {createTrade.isPending && tradeType === 'SELL' ? 'Processing...' : 'SELL'}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
