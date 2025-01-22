// app/admin/deposits/page.tsx
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
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import Loading from "@/app/loading";

export default function PendingDepositsPage() {
  const [page, setPage] = useState(1);
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [usdValue, setUsdValue] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pendingDeposits", page],
    queryFn: async () => {
      const res = await fetch(`/api/Admindeposits?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ depositId, usdValue }: { depositId: string; usdValue: number }) => {
      const res = await fetch("/api/Admindeposits", {
        method: "POST",
        body: JSON.stringify({ depositId, usdValue, action: "approve" }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingDeposits"] });
      setSelectedDeposit(null);
      setUsdValue("");
    },
  });

  if (isLoading) return <div className="text-white"><Loading /></div>;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Pending Deposits</h1>

        <div className="bg-yellow-50 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-yellow-100">
              <TableRow>
                <TableHead className="text-black font-bold">User</TableHead>
                <TableHead className="text-black font-bold">Amount</TableHead>
                <TableHead className="text-black font-bold">Crypto</TableHead>
                <TableHead className="text-black font-bold">Proof</TableHead>
                <TableHead className="text-black font-bold">Requested</TableHead>
                <TableHead className="text-black font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.deposits.map((item: any) => (
                <TableRow key={item.deposit.id} className="hover:bg-yellow-100">
                  <TableCell className="text-black">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.user.userName}</span>
                      <span className="text-sm text-gray-600">{item.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-black">
                    {item.deposit.amount} {item.deposit.cryptoType}
                  </TableCell>
                  <TableCell className="text-black">{item.deposit.cryptoType}</TableCell>
                  <TableCell className="text-black">
                    <a 
                      href={item.deposit.proofImageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Proof
                    </a>
                  </TableCell>
                  <TableCell className="text-black">
                    {formatDistanceToNow(new Date(item.deposit.createdAt))} ago
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => setSelectedDeposit(item.deposit)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={!!selectedDeposit} onOpenChange={() => setSelectedDeposit(null)}>
          <DialogContent className="bg-black text-white">
            <DialogHeader>
              <DialogTitle>Approve Deposit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm">
                Enter USD value for {selectedDeposit?.amount} {selectedDeposit?.cryptoType}
              </div>
              <Input
                type="number"
                value={usdValue}
                onChange={(e) => setUsdValue(e.target.value)}
                placeholder="USD Value"
                className="bg-yellow-50 text-black"
              />
              <Button
                onClick={() => {
                  approveMutation.mutate({
                    depositId: selectedDeposit?.id,
                    usdValue: parseFloat(usdValue),
                  });
                }}
                disabled={!usdValue || approveMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Confirm Approval
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
