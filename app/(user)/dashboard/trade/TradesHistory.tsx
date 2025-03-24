// // components/TradesHistory.tsx
// "use client";
// import { useQuery } from "@tanstack/react-query";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { formatDistance } from "date-fns";
// import { Loader2 } from "lucide-react";

// interface Trade {
//   id: string;
//   symbol: string;
//   type: string;
//   amount: number;
//   leverage: number;
//   expiry: string;
//   status: string;
//   openPrice: number;
//   closePrice: number;
//   profit: number;
//   createdAt: string;
// }

// export function TradesHistory() {
//   const { data: trades, isLoading } = useQuery({
//     queryKey: ["trades"],
//     queryFn: async () => {
//       const response = await fetch("/api/tradeshistory");
//       if (!response.ok) {
//         throw new Error("Failed to fetch trades");
//       }
//       return response.json() as Promise<Trade[]>;
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-md border max-w-screen-lg md:w-full">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Symbol</TableHead>
//             <TableHead>Type</TableHead>
//             <TableHead>Amount</TableHead>
//             <TableHead>Leverage</TableHead>
//             <TableHead>Open Price</TableHead>
//             <TableHead>Close Price</TableHead>
//             <TableHead>Profit/Loss</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Date</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {trades?.map((trade) => (
//             <TableRow key={trade.id}>
//               <TableCell>{trade.symbol}</TableCell>
//               <TableCell className={trade.type === "BUY" ? "text-green-600" : "text-red-600"}>
//                 {trade.type}
//               </TableCell>
//               <TableCell>${trade.amount.toFixed(2)}</TableCell>
//               <TableCell>{trade.leverage}x</TableCell>
//               <TableCell>${trade.openPrice?.toFixed(2) || "N/A"}</TableCell>
//               <TableCell>${trade.closePrice?.toFixed(2) || "***"}</TableCell>
//               <TableCell className={trade.profit >= 0 ? "text-green-600" : "text-red-600"}>
//                 ${trade.profit?.toFixed(2) || "0.00"}
//               </TableCell>
//               <TableCell>
//                 <span className={`px-2 py-1 rounded-full text-xs ${
//                   trade.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
//                 }`}>
//                   {trade.status}
//                 </span>
//               </TableCell>
//               <TableCell>
//                 {formatDistance(new Date(trade.createdAt), new Date(), { addSuffix: true })}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance } from "date-fns";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Trade {
  id: string;
  symbol: string;
  type: string;
  amount: number;
  leverage: number;
  expiry: string;
  status: string;
  openPrice: number;
  closePrice: number;
  profit: number;
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function TradesHistory() {
  const { data: trades, isLoading } = useQuery({
    queryKey: ["trades"],
    queryFn: async () => {
      const response = await fetch("/api/tradeshistory");
      if (!response.ok) throw new Error("Failed to fetch trades");
      return response.json() as Promise<Trade[]>;
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-card shadow-lg max-w-screen-lg md:w-full overflow-hidden"
    >
      <Table className="relative">
        <TableHeader className="sticky top-0 bg-background z-10 shadow-sm bg-yellow-500 text-black">
          <TableRow>
            {["Symbol", "Type", "Amount", "Leverage", "Open", "Close", "P/L", "Status", "Date"].map((header) => (
              <TableHead key={header} className="font-semibold py-4">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence>
            {isLoading ? (
              <motion.tr
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-32"
              >
                <td colSpan={9} className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </td>
              </motion.tr>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="contents"
              >
                {trades?.map((trade) => (
                  <motion.tr
                    key={trade.id}
                    variants={rowVariants}
                    className={`${
                      trade.status === 'win' 
                        ? 'bg-green-500 hover:bg-green-300 text-black' 
                        : trade.status === 'loss' 
                          ? 'bg-red-500 hover:bg-red-300 text-black' 
                          : 'hover:bg-muted/50'
                    } transition-colors`}
                  >
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>
                      <motion.span
                        className={`inline-block px-2 py-1 rounded-md ${
                          trade.type === "BUY" 
                            ? 'text-black shadow-2xl bg-green-800' 
                            : 'text-white shadow-2xl bg-red-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {trade.type}
                      </motion.span>
                    </TableCell>
                    <TableCell>${trade.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className="bg-accent px-2 py-1 rounded-md">
                        {trade.leverage}x
                      </span>
                    </TableCell>
                    <TableCell>${trade.openPrice?.toFixed(2) || "***"}</TableCell>
                    <TableCell>${trade.closePrice?.toFixed(2) || "***"}</TableCell>
                    <TableCell className={`font-semibold ${
                      (trade.profit ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${trade.profit?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell>
                      <motion.span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          trade.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : trade.status === 'loss' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {trade.status}
                      </motion.span>
                    </TableCell>
                    <TableCell>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        {formatDistance(new Date(trade.createdAt), new Date(), {
                          addSuffix: true,
                        })}
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </motion.div>
  );
}
