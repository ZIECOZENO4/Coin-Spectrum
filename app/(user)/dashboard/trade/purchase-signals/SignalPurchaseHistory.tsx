// components/SignalPurchaseHistory.tsx
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
import { formatDistance, format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SignalPurchase {
  purchase: {
    id: string;
    amount: number;
    status: string;
    purchasedAt: string;
    expiresAt: string;
  };
  signal: {
    id: string;
    name: string;
    description: string;
    price: number;
    type: string;
  };
}

export function SignalPurchaseHistory() {
  const { data: signalHistory, isLoading } = useQuery({
    queryKey: ["signal-history"],
    queryFn: async () => {
      const response = await fetch("/api/signal-history");
      if (!response.ok) {
        throw new Error("Failed to fetch signal history");
      }
      return response.json() as Promise<SignalPurchase[]>;
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
            <TableHead>Signal Name</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Time Remaining</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signalHistory?.map((item) => {
            const isExpired = new Date(item.purchase.expiresAt) < new Date();
            const isActive = item.purchase.status === "active" && !isExpired;

            return (
              <TableRow key={item.purchase.id}>
                <TableCell className="font-medium">
                  {item.signal.name}
                </TableCell>
                <TableCell>${item.purchase.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={`${
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {isExpired ? "Expired" : item.purchase.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(item.purchase.purchasedAt), "PPp")}
                </TableCell>
                <TableCell>
                  {format(new Date(item.purchase.expiresAt), "PPp")}
                </TableCell>
                <TableCell>
                  {isExpired
                    ? "Expired"
                    : formatDistance(new Date(item.purchase.expiresAt), new Date(), {
                        addSuffix: true,
                      })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
