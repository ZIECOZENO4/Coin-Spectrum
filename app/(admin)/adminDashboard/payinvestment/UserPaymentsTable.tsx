// app/admin/payinvestment/UserPaymentsTable.tsx
"use client";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { useAddInvestmentProfit } from "@/lib/tenstack-hooks/useAddInvestmentProfit";

interface UserPaymentsTableProps {
  search: string;
}

export type UserPaymentItem = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  totalInvestmentAmount: number;
  investmentCount: number;
  latestInvestment: {
    id: string;
    name: string;
    amount: number;
    createdAt: string;
  } | null;
};

export function UserPaymentsTable({ search }: UserPaymentsTableProps) {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserPaymentItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"profit" | "bonus">("profit");

  // State to track actioned rows for disabling
  const [actionedRows, setActionedRows] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["userPayments", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
      });
      const res = await fetch(`/api/payinvestment?${params}`);
      if (!res.ok) throw new Error("Failed to fetch users for payment");
      return res.json();
    },
  });

  const addProfitMutation = useAddInvestmentProfit();

  const handlePayment = async (userId: string, amount: number, type: "profit" | "bonus") => {
    if (!selectedUser) return;
    
    try {
      // For now, we'll use the existing addInvestmentProfit hook
      // You might need to create a new hook for general payments
      await addProfitMutation.mutateAsync({ 
        userInvestmentId: selectedUser.latestInvestment?.id || userId, 
        amount 
      }, {
        onSuccess: () => {
          setActionedRows(prev => new Set(prev).add(userId));
          setIsModalOpen(false);
          setSelectedUser(null);
          setPaymentAmount("");
          queryClient.invalidateQueries({ queryKey: ["userPayments", page, search] });
          // Add toast notification for success
        },
        onError: (error) => {
          console.error("Error processing payment:", error);
          // Add toast notification for error
        }
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      // Add toast notification for error
    }
  };

  const openModalWithUser = (user: UserPaymentItem) => {
    setSelectedUser(user);
    setPaymentAmount("");
    setPaymentType("profit");
    setIsModalOpen(true);
  };
  
  if (isLoading) return <div className="text-white"><Loading /></div>;
  
  if (!data || !Array.isArray(data.users)) {
    return <div className="text-black p-4">No users found or error loading data.</div>;
  }

  return (
    <div className="bg-yellow-50 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-yellow-100">
          <TableRow>
            <TableHead className="text-black font-bold">User</TableHead>
            <TableHead className="text-black font-bold">Total Investment</TableHead>
            <TableHead className="text-black font-bold">Investment Count</TableHead>
            <TableHead className="text-black font-bold">Latest Investment</TableHead>
            <TableHead className="text-black font-bold">Member Since</TableHead>
            <TableHead className="text-black font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.users.map((user: UserPaymentItem) => (
            <TableRow 
              key={user.id} 
              className={`transition-opacity duration-300 ease-in-out ${actionedRows.has(user.id) ? "opacity-30 pointer-events-none" : "hover:bg-yellow-100"}`}
            >
              <TableCell className="text-black">
                <div className="flex flex-col">
                  <span className="font-medium">{user.fullName || "N/A"}</span>
                  <span className="text-sm text-gray-600">{user.email}</span>
                  {user.username && (
                    <span className="text-xs text-gray-500">@{user.username}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-black font-medium">
                ${(user.totalInvestmentAmount || 0).toLocaleString()}
              </TableCell>
              <TableCell className="text-black">
                {user.investmentCount || 0}
              </TableCell>
              <TableCell className="text-black">
                {user.latestInvestment ? (
                  <div className="flex flex-col">
                    <span className="font-medium">{user.latestInvestment.name}</span>
                    <span className="text-sm text-gray-600">
                      ${(user.latestInvestment.amount || 0).toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">No investments</span>
                )}
              </TableCell>
              <TableCell className="text-black">
                {formatDistanceToNow(new Date(user.createdAt))} ago
              </TableCell>
              <TableCell className="text-black space-x-2">
                <Button 
                   variant="outline" 
                   size="sm"
                   className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                   onClick={() => openModalWithUser(user)}
                   disabled={actionedRows.has(user.id)}
                >
                  Pay
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Payment Modal */}
      {selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
            setPaymentAmount("");
          }
          setIsModalOpen(open);
        }}>
          <DialogContent className="sm:max-w-[525px] bg-white dark:bg-gray-900 shadow-2xl rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">Process Payment</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Process payment for {selectedUser.fullName || "N/A"} ({selectedUser.email}).
                <br />
                Total Investment: ${(selectedUser.totalInvestmentAmount || 0).toLocaleString()}
                {selectedUser.latestInvestment && (
                  <>
                    <br />
                    Latest Investment: {selectedUser.latestInvestment.name} - ${(selectedUser.latestInvestment.amount || 0).toLocaleString()}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="paymentType" className="text-right col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payment Type
                </label>
                <select
                  id="paymentType"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as "profit" | "bonus")}
                  className="col-span-3 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                >
                  <option value="profit">Profit Payment</option>
                  <option value="bonus">Bonus Payment</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="paymentAmount" className="text-right col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount
                </label>
                <Input 
                  id="paymentAmount" 
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter payment amount"
                  className="col-span-3 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={() => {
                  const amount = parseFloat(paymentAmount);
                  if (isNaN(amount) || amount <= 0) {
                    alert("Please enter a valid positive payment amount.");
                    return;
                  }
                  handlePayment(selectedUser.id, amount, paymentType);
                }}
                disabled={addProfitMutation.isPending}
                className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
              >
                {addProfitMutation.isPending ? "Processing..." : `Process ${paymentType === "profit" ? "Profit" : "Bonus"} Payment`}
              </Button>
            </DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground dark:text-gray-400 dark:hover:text-gray-100">
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>
                    <span className="sr-only">Close</span>
                </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
      
      <div className="flex items-center justify-between p-4 bg-yellow-100 dark:bg-gray-800">
        <div className="text-sm text-black">
          Page {page} of {data?.totalPages || 1}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-black text-yellow-50 hover:bg-gray-800"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={page === data?.totalPages}
            className="bg-black text-yellow-50 hover:bg-gray-800"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
