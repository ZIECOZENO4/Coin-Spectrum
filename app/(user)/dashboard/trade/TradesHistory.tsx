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
import { useRouter } from "next/navigation";

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

export function TradesHistory() {
  const { data: trades, isLoading } = useQuery({
    queryKey: ["trades"],
    queryFn: async () => {
      const response = await fetch("/api/tradeshistory");
      if (!response.ok) throw new Error("Failed to fetch trades");
      return response.json() as Promise<Trade[]>;
    },
  });

  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
    hover: { scale: 1.02, boxShadow: "0 4px 32px 0 rgba(0,0,0,0.25)" },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#1e293b] shadow-2xl max-w-screen-lg w-full overflow-hidden backdrop-blur-md"
    >
      <Table className="relative">
        <TableHeader className="sticky top-0 z-10 bg-gradient-to-r from-[#23272f] to-[#18181b] shadow-md">
          <TableRow>
            {["Symbol", "Type", "Amount", "Leverage", "Open", "Close", "P/L", "Status", "Date"].map((header) => (
              <TableHead key={header} className="font-semibold text-slate-200 py-4 tracking-wide uppercase">
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
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </td>
              </motion.tr>
            ) : (
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="contents"
              >
                {trades?.map((trade) => (
                  <motion.tr
                    key={trade.id}
                    variants={rowVariants}
                    whileHover="hover"
                    className={`cursor-pointer transition-all duration-200 rounded-xl ${
                      trade.status === 'completed'
                        ? 'bg-gradient-to-r from-green-900/60 to-green-800/30 hover:from-green-700/80 hover:to-green-600/40 text-green-200'
                        : trade.status === 'rejected'
                        ? 'bg-gradient-to-r from-red-900/60 to-red-800/30 hover:from-red-700/80 hover:to-red-600/40 text-red-200'
                        : 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-200'
                    }`}
                    onClick={() => router.push(`/dashboard/history/receipt?id=${trade.id}&type=${trade.type}&amount=${trade.amount}&description=${trade.status}&date=${trade.createdAt}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="font-bold">{trade.symbol}</TableCell>
                    <TableCell>
                      <motion.span
                        className={`inline-block px-2 py-1 rounded-md font-semibold shadow ${
                          trade.type === "BUY"
                            ? 'bg-green-700 text-green-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {trade.type}
                      </motion.span>
                    </TableCell>
                    <TableCell>${trade.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className="bg-slate-700 px-2 py-1 rounded-md text-slate-300 font-mono">
                        {trade.leverage}x
                      </span>
                    </TableCell>
                    <TableCell>${trade.openPrice?.toFixed(2) || "***"}</TableCell>
                    <TableCell>${trade.closePrice?.toFixed(2) || "***"}</TableCell>
                    <TableCell className={`font-semibold ${
                      (trade.profit ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${trade.profit?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell>
                      <motion.span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow ${
                          trade.status === 'completed'
                            ? 'bg-green-300/20 text-green-400 animate-pulse'
                            : trade.status === 'rejected'
                            ? 'bg-red-300/20 text-red-400 animate-pulse'
                            : 'bg-slate-700/60 text-slate-300'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {trade.status === 'completed' ? 'WON' :
                         trade.status === 'rejected' ? 'LOST' : trade.status}
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
              </motion.tbody>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </motion.div>
  );
}
