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

interface Withdrawal {
  id: string;
  amount: number;
  cryptoType: string;
  walletAddress: string;
  createdAt: string;
}

interface User {
  fullName: string;
  email: string;
}

interface WithdrawalData {
  withdrawal: Withdrawal;
  user: User;
}

interface ApiResponse {
  withdrawals: WithdrawalData[];
  totalPages: number;
}

export default function WithdrawalsPage() {
  const [page, setPage] = useState(1);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["withdrawals", page],
    queryFn: async () => {
      const res = await fetch(`/api/withdrawals?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: async ({ withdrawalId, action, rejectionReason, amount }: {
      withdrawalId: string;
      action: "approve" | "reject";
      rejectionReason?: string;
      amount?: number;
    }) => {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ withdrawalId, action, rejectionReason, amount }),
      });
      if (!res.ok) throw new Error("Failed to process withdrawal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      setSelectedWithdrawal(null);
      setRejectionReason("");
      setEditAmount("");
      setIsEditingAmount(false);
    },
  });

  const handleApproveClick = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setEditAmount(withdrawal.amount.toString());
    setIsEditingAmount(true);
  };

  const handleApproveConfirm = () => {
    if (selectedWithdrawal && editAmount) {
      withdrawalMutation.mutate({
        withdrawalId: selectedWithdrawal.id,
        action: "approve",
        amount: parseFloat(editAmount)
      });
    }
  };

  if (isLoading) return <div><Loading /></div>;
  
  if (!data?.withdrawals || !Array.isArray(data.withdrawals)) {
    return <div className="text-white">No withdrawals found</div>;
  }

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
              {data.withdrawals.map((item: WithdrawalData) => {
                if (!item?.withdrawal || !item?.user) return null;
                
                return (
                  <TableRow key={item.withdrawal.id} className="hover:bg-yellow-100">
                    <TableCell className="text-black">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.user.fullName}</span>
                        <span className="text-sm text-gray-600">{item.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-black">
                      ${Number(item.withdrawal.amount).toLocaleString()}
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
                      <div className="space-x-2 flex gap-4">
                        <Button
                          onClick={() => handleApproveClick(item.withdrawal)}
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedWithdrawal(item.withdrawal);
                            setIsEditingAmount(false);
                          }}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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

        {/* Amount Edit Dialog */}
        <Dialog 
          open={isEditingAmount} 
          onOpenChange={(open) => {
            if (!open) {
              setIsEditingAmount(false);
              setSelectedWithdrawal(null);
              setEditAmount("");
            }
          }}
        >
          <DialogContent className="bg-black text-white">
            <DialogHeader>
              <DialogTitle>Edit Withdrawal Amount</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm">Original Amount: ${selectedWithdrawal?.amount.toLocaleString()}</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter new amount"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="bg-yellow-50 text-black"
                />
              </div>
              <Button
                onClick={handleApproveConfirm}
                disabled={!editAmount || parseFloat(editAmount) <= 0}
                className="bg-green-600 text-white hover:bg-green-700 w-full"
              >
                Confirm Approval
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Rejection Dialog */}
        <Dialog 
          open={!!selectedWithdrawal && !isEditingAmount} 
          onOpenChange={() => setSelectedWithdrawal(null)}
        >
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
                  if (selectedWithdrawal) {
                    withdrawalMutation.mutate({
                      withdrawalId: selectedWithdrawal.id,
                      action: "reject",
                      rejectionReason,
                    });
                  }
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
