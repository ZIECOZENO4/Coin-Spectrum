"use client";
import { useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useDataTableStore } from "@/lib/zuustand-store";
import NoData from "../../../../components/noData";
import { useAddInvestmentProfit } from "@/lib/tenstack-hooks/useAddInvestmentProfit";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";

export type UserPaymentData = {
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

export function DataTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { width } = useWindowSize();
  const isSmallScreen = (width ?? 0) < 768;
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserPaymentData | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"profit" | "bonus">("profit");
  
  const {
    search,
    page,
    setPage,
    sort,
    order,
  } = useDataTableStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userPayments", page, search, sort, order],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        sort,
        order,
      });
      const res = await fetch(`/api/payinvestment?${params}`);
      if (!res.ok) throw new Error("Failed to fetch users for payment");
      return res.json();
    },
  });

  const addProfitMutation = useAddInvestmentProfit();

  // State to track which user payments are pending
  const [pendingPayments, setPendingPayments] = useState<Set<string>>(new Set());
  // State to track which user payments have been completed
  const [completedPayments, setCompletedPayments] = useState<Set<string>>(new Set());

  const handlePayment = async (userId: string, amount: number, type: "profit" | "bonus") => {
    if (!selectedUser) return;
    
    setPendingPayments(prev => new Set(prev).add(userId));
    
    try {
      // For now, we'll use the existing addInvestmentProfit hook
      // You might need to create a new hook for general payments
      await addProfitMutation.mutateAsync({ 
        userInvestmentId: selectedUser.latestInvestment?.id || userId, 
        amount 
      }, {
        onSuccess: () => {
          setPendingPayments(prev => {
            const newState = new Set(prev);
            newState.delete(userId);
            return newState;
          });
          setCompletedPayments(prev => new Set(prev).add(userId));
          setIsModalOpen(false);
          setSelectedUser(null);
          setPaymentAmount("");
          // Add toast notification for success
        },
        onError: (error) => {
          setPendingPayments(prev => {
            const newState = new Set(prev);
            newState.delete(userId);
            return newState;
          });
          console.error("Error processing payment:", error);
          // Add toast notification for error
        }
      });
    } catch (error) {
      setPendingPayments(prev => {
        const newState = new Set(prev);
        newState.delete(userId);
        return newState;
      });
      console.error("Error initiating payment:", error);
      // Add toast notification for error
    }
  };

  const handleRowClick = (rowData: UserPaymentData) => {
    setSelectedUser(rowData);
    setPaymentAmount("");
    setPaymentType("profit");
    setIsModalOpen(true);
  };

  const columns: ColumnDef<UserPaymentData>[] = [
    {
      id: "serialNumber",
      header: () => <span className="md:text-md text-xs font-semibold">S/N</span>,
      cell: ({ row }) => <span className="md:text-md text-xs">{row.index + 1}</span>,
    },
    {
      accessorKey: "fullName",
      header: () => <span className="md:text-md text-xs font-semibold">User</span>,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="md:text-md text-xs font-medium">{row.original.fullName || "N/A"}</span>
          <span className="text-xs text-gray-500">{row.original.email}</span>
          {row.original.username && (
            <span className="text-xs text-gray-400">@{row.original.username}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "totalInvestmentAmount",
      header: () => <span className="md:text-md text-xs font-semibold">Total Investment</span>,
      cell: ({ row }) => (
        <span className="md:text-md text-xs font-medium">
          ${(row.original.totalInvestmentAmount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "investmentCount",
      header: () => <span className="md:text-md text-xs font-semibold">Investments</span>,
      cell: ({ row }) => (
        <Badge variant="secondary" className="md:text-md text-xs">
          {row.original.investmentCount || 0}
        </Badge>
      ),
    },
    {
      accessorKey: "latestInvestment",
      header: () => <span className="md:text-md text-xs font-semibold">Latest Investment</span>,
      cell: ({ row }) => (
        <div className="flex flex-col">
          {row.original.latestInvestment ? (
            <>
              <span className="md:text-md text-xs font-medium">
                {row.original.latestInvestment.name}
              </span>
              <span className="text-xs text-gray-500">
                ${(row.original.latestInvestment.amount || 0).toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-500">No investments</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <span className="md:text-md text-xs font-semibold">Member Since</span>,
      cell: ({ row }) => (
        <span className="md:text-md text-xs">
          {formatDistanceToNow(new Date(row.original.createdAt))} ago
        </span>
      ),
    },
  ];

  const tableInstance = useReactTable<UserPaymentData>({
    data: data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  if (isLoading) return <div><Loading /></div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!data?.users.length) return <NoData />; 
  
  return (
    <div>
      <div className="flex flex-col items-center justify-between">
        <div className="w-full overflow-x-auto">
          <div className="rounded-md">
            <Table>
              <TableHeader>
                {tableInstance.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {tableInstance.getRowModel().rows.map((row) => (
                  <TableRow 
                    key={row.id} 
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleRowClick(row.original)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="md:text-md text-xs">
            Page {page} of {data?.totalPages || 1}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(page + 1, data?.totalPages || 1))}
              disabled={page === (data?.totalPages || 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[525px] bg-background dark:bg-neutral-900 shadow-2xl rounded-lg">
            <DialogHeader className="pt-6 px-6">
              <DialogTitle className="text-2xl font-semibold dark:text-white">Process Payment</DialogTitle>
              <DialogDescription className="dark:text-neutral-400">
                Process payment for {selectedUser.fullName || "N/A"} ({selectedUser.email}).
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground dark:text-neutral-500">User Information</h3>
                <p className="text-lg font-semibold dark:text-white">{selectedUser.fullName || "N/A"}</p>
                <p className="text-sm text-muted-foreground dark:text-neutral-400">{selectedUser.email}</p>
                {selectedUser.username && (
                  <p className="text-sm text-muted-foreground dark:text-neutral-400">@{selectedUser.username}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground dark:text-neutral-500">Total Investment</h3>
                <p className="text-lg dark:text-white">${(selectedUser.totalInvestmentAmount || 0).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground dark:text-neutral-500">Investment Count</h3>
                <p className="text-lg dark:text-white">{selectedUser.investmentCount || 0}</p>
              </div>
              {selectedUser.latestInvestment && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground dark:text-neutral-500">Latest Investment</h3>
                  <p className="text-lg dark:text-white">{selectedUser.latestInvestment.name}</p>
                  <p className="text-sm text-muted-foreground dark:text-neutral-400">
                    ${(selectedUser.latestInvestment.amount || 0).toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground dark:text-neutral-500">Member Since</h3>
                <p className="text-lg dark:text-white">{formatDistanceToNow(new Date(selectedUser.createdAt))} ago</p>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label htmlFor="paymentType" className="text-sm font-medium text-muted-foreground dark:text-neutral-500">
                    Payment Type
                  </label>
                  <select
                    id="paymentType"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as "profit" | "bonus")}
                    className="w-full p-2 mt-1 border rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  >
                    <option value="profit">Profit Payment</option>
                    <option value="bonus">Bonus Payment</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="paymentAmount" className="text-sm font-medium text-muted-foreground dark:text-neutral-500">
                    Payment Amount
                  </label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter payment amount"
                    className="mt-1 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="px-6 pb-6 sm:justify-start space-x-2">
              <Button
                variant="default"
                onClick={() => {
                  const amount = parseFloat(paymentAmount);
                  if (isNaN(amount) || amount <= 0) {
                    alert("Please enter a valid positive payment amount.");
                    return;
                  }
                  handlePayment(selectedUser.id, amount, paymentType);
                }}
                disabled={pendingPayments.has(selectedUser.id) || completedPayments.has(selectedUser.id) || addProfitMutation.isPending}
                className="transition-all duration-150 ease-in-out hover:scale-105 active:scale-95"
              >
                {pendingPayments.has(selectedUser.id)
                  ? "Processing Payment..."
                  : completedPayments.has(selectedUser.id)
                  ? "Payment Completed"
                  : `Process ${paymentType === "profit" ? "Profit" : "Bonus"} Payment`}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="transition-all duration-150 ease-in-out hover:scale-105 active:scale-95"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
