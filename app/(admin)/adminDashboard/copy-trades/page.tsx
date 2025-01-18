// app/admin/copy-trades/page.tsx
"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Loading from "@/app/loading";

export default function CopyTradesPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["copyTrades", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin-copy-trades?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    refetchInterval: 30000 // Refetch every 30 seconds to check for auto-approvals
  });

  const tradeMutation = useMutation({
    mutationFn: async ({ tradeId, action }: { tradeId: string; action: "approve" | "reject" }) => {
      const res = await fetch("/api/admin-copy-trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tradeId, action }),
      });
      if (!res.ok) throw new Error("Failed to process trade");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copyTrades"] });
    },
  });

  if (isLoading) return <div className="text-white"><Loading/></div>;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Copy Trade Requests</h1>

        <div className="bg-yellow-50 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-yellow-100">
              <TableRow>
                <TableHead className="text-black font-bold">User</TableHead>
                <TableHead className="text-black font-bold">Trader</TableHead>
                <TableHead className="text-black font-bold">Amount</TableHead>
                <TableHead className="text-black font-bold">Status</TableHead>
                <TableHead className="text-black font-bold">Requested</TableHead>
                <TableHead className="text-black font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.copyTrades.map((item: any) => (
                <TableRow 
                  key={item.trade.id} 
                  className={`hover:bg-yellow-100 ${
                    item.trade.status !== "active" ? "opacity-50" : ""
                  }`}
                >
                  <TableCell className="text-black">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.user.fullName}</span>
                      <span className="text-sm text-gray-600">{item.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-black">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.trader.name}</span>
                      <span className="text-sm text-gray-600">
                        Min Capital: ${item.trader.minCapital}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-black">
                    ${item.trade.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-black">{item.trade.status}</TableCell>
                  <TableCell className="text-black">
                    {formatDistanceToNow(new Date(item.trade.createdAt))} ago
                  </TableCell>
                  <TableCell>
                    {item.trade.status === "active" && (
                      <div className="space-x-2 flex gap-2">
                        <Button
                          onClick={() => 
                            tradeMutation.mutate({ 
                              tradeId: item.trade.id, 
                              action: "approve" 
                            })
                          }
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => 
                            tradeMutation.mutate({ 
                              tradeId: item.trade.id, 
                              action: "reject" 
                            })
                          }
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage(p => p + 1)}
            disabled={page === data?.totalPages}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
