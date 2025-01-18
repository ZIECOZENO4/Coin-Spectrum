// app/admin/withdrawals/page.tsx
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

export default function WithdrawalsPage() {
  const [page, setPage] = useState(1);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["withdrawals", page],
    queryFn: async () => {
      const res = await fetch(`/api/withdrawals?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: async ({ withdrawalId, action, rejectionReason }: any) => {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        body: JSON.stringify({ withdrawalId, action, rejectionReason }),
      });
      if (!res.ok) throw new Error("Failed to process withdrawal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      setSelectedWithdrawal(null);
      setRejectionReason("");
    },
  });

  if (isLoading) return <div><Loading /></div>;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Pending Withdrawals</h1>
        
        <div className="bg-yellow-50 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-yellow-100">
              <TableRow>
                <TableHead className="text-black font-bold">User</TableHead>
                <TableHead className="text-black font-bold">Amount</TableHead>
                <TableHead className="text-black font-bold">Crypto</TableHead>
                <TableHead className="text-black font-bold">Wallet</TableHead>
                <TableHead className="text-black font-bold">Requested</TableHead>
                <TableHead className="text-black font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.withdrawals.map((item: any) => (
                <TableRow key={item.withdrawal.id} className="hover:bg-yellow-100">
                  <TableCell className="text-black">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.user.fullName}</span>
                      <span className="text-sm text-gray-600">{item.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-black">
                    ${item.withdrawal.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-black">
                    {item.withdrawal.cryptoType}
                  </TableCell>
                  <TableCell className="text-black">
                    {item.withdrawal.walletAddress}
                  </TableCell>
                  <TableCell className="text-black">
                    {formatDistanceToNow(new Date(item.withdrawal.createdAt))} ago
                  </TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button
                        onClick={() => 
                          withdrawalMutation.mutate({
                            withdrawalId: item.withdrawal.id,
                            action: "approve"
                          })
                        }
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => setSelectedWithdrawal(item.withdrawal)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-white">
            Page {page} of {data?.totalPages || 1}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={page === data?.totalPages}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Next
            </Button>
          </div>
        </div>

        <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
          <DialogContent className="bg-black text-white">
            <DialogHeader>
              <DialogTitle>Reject Withdrawal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-yellow-50 text-black"
              />
              <Button
                onClick={() => {
                  withdrawalMutation.mutate({
                    withdrawalId: selectedWithdrawal?.id,
                    action: "reject",
                    rejectionReason,
                  });
                }}
                className="bg-red-600 text-white hover:bg-red-700 w-full"
              >
                Confirm Rejection
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
