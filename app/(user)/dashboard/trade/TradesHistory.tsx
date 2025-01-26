// components/TradesHistory.tsx
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
      const response = await fetch("/api/trades");
      if (!response.ok) {
        throw new Error("Failed to fetch trades");
      }
      return response.json() as Promise<Trade[]>;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Leverage</TableHead>
            <TableHead>Open Price</TableHead>
            <TableHead>Close Price</TableHead>
            <TableHead>Profit/Loss</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades?.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell>{trade.symbol}</TableCell>
              <TableCell className={trade.type === "BUY" ? "text-green-600" : "text-red-600"}>
                {trade.type}
              </TableCell>
              <TableCell>${trade.amount.toFixed(2)}</TableCell>
              <TableCell>{trade.leverage}x</TableCell>
              <TableCell>${trade.openPrice?.toFixed(2) || "N/A"}</TableCell>
              <TableCell>${trade.closePrice?.toFixed(2) || "N/A"}</TableCell>
              <TableCell className={trade.profit >= 0 ? "text-green-600" : "text-red-600"}>
                ${trade.profit?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  trade.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {trade.status}
                </span>
              </TableCell>
              <TableCell>
                {formatDistance(new Date(trade.createdAt), new Date(), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
