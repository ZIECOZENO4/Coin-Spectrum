// components/UserCopyTrades.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistance } from "date-fns";
import { Loader2 } from "lucide-react";

interface CopyTrade {
  copyTrade: {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  };
  trader: {
    name: string;
    percentageProfit: number;
    totalProfit: number;
    rating: number;
  };
}

export function UserCopyTrades() {
  const { data: copyTrades, isLoading } = useQuery({
    queryKey: ["user-copy-trades"],
    queryFn: async () => {
      const response = await fetch("/api/user-copy-trades");
      if (!response.ok) throw new Error("Failed to fetch copy trades");
      return response.json() as Promise<CopyTrade[]>;
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Trader Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Profit %</TableHead>
          <TableHead>Total Profit</TableHead>
          <TableHead>Started</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {copyTrades?.map((item) => (
          <TableRow key={item.copyTrade.id}>
            <TableCell>{item.trader.name}</TableCell>
            <TableCell>${item.copyTrade.amount.toFixed(2)}</TableCell>
            <TableCell>{item.copyTrade.status}</TableCell>
            <TableCell>{item.trader.percentageProfit}%</TableCell>
            <TableCell>${item.trader.totalProfit.toFixed(2)}</TableCell>
            <TableCell>
              {formatDistance(new Date(item.copyTrade.createdAt), new Date(), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
