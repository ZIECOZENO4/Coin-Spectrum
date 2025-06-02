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
import Link from "next/link";
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
  DialogTrigger, // Assuming DialogTrigger might be useful, or we'll trigger programmatically
} from "@/components/ui/dialog"; // Added Dialog components
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useDataTableStore } from "@/lib/zuustand-store";
import NoData from "../../../../components/noData";
import { useDeleteUserInvestment } from "@/lib/tenstack-hooks/useAdminInvestments";
import { useInvestments } from "@/lib/tenstack-hooks/useAdminFetchInvestments";
import { InvestmentNameEnum } from "@/lib/db/schema";
import Loading from "@/app/loading";
import { useAddInvestmentProfit } from "@/lib/tenstack-hooks/useAddInvestmentProfit";

export type UserInvestmentData = {
  id: string;
  userId: string;
  user: {
    fullName: string;
    email: string;
  };
  investment: {
    id: string;
    name: InvestmentNameEnum;
    price: number;
    profitPercent: number;
    durationDays: number;
  };
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export function DataTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { width } = useWindowSize();
  const isSmallScreen = (width ?? 0) < 768;
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestmentData | null>(null);
  
  const {
    search,
    page,
    setPage,
    sort,
    order,
  } = useDataTableStore();

  const { data, isLoading, isError, error } = useInvestments(
    page,
    sort,
    order,
    search
  );

  const deleteInvestmentMutation = useDeleteUserInvestment();
  const addProfitMutation = useAddInvestmentProfit();

  // State to track which investment payouts are pending
  const [pendingPayouts, setPendingPayouts] = useState<Set<string>>(new Set());
  // State to track which investment payouts have been completed
  const [completedPayouts, setCompletedPayouts] = useState<Set<string>>(new Set());

  const handleDelete = async (id: string) => {
    try {
      await deleteInvestmentMutation.mutateAsync(id);
      setIsModalOpen(false); // Close modal on success
      setSelectedInvestment(null);
    } catch (error) {
      console.error("Error deleting investment:", error);
    }
  };

  const handleAddProfit = async (userInvestmentId: string) => {
    setPendingPayouts(prev => new Set(prev).add(userInvestmentId));
    try {
      await addProfitMutation.mutateAsync(userInvestmentId, {
        onSuccess: () => {
          setPendingPayouts(prev => {
            const newState = new Set(prev);
            newState.delete(userInvestmentId);
            return newState;
          });
          setCompletedPayouts(prev => new Set(prev).add(userInvestmentId));
          // Optionally close modal or update its content
        },
        onError: () => {
           setPendingPayouts(prev => {
            const newState = new Set(prev);
            newState.delete(userInvestmentId);
            return newState;
          });
        }
      });
    } catch (error) {
      console.error("Error initiating add profit mutation:", error);
       setPendingPayouts(prev => {
        const newState = new Set(prev);
        newState.delete(userInvestmentId);
        return newState;
      });
    }
  };

  const handleRowClick = (rowData: UserInvestmentData) => {
    setSelectedInvestment(rowData);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<UserInvestmentData>[] = [
    {
      id: "serialNumber",
      header: () => <span className="md:text-md text-xs font-semibold">S/N</span>,
      cell: ({ row }) => <span className="md:text-md text-xs">{row.index + 1}</span>,
    },
    {
      accessorKey: "user.fullName",
      header: () => <span className="md:text-md text-xs font-semibold">User</span>,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="md:text-md text-xs font-medium">{row.original.user.fullName}</span>
          <span className="text-xs text-gray-500">{row.original.user.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "investment.name",
      header: () => <span className="md:text-md text-xs font-semibold">Investment Plan</span>,
      cell: ({ row }) => (
        <span className="md:text-md text-xs">{row.original.investment.name}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <span className="md:text-md text-xs font-semibold">Amount</span>,
      cell: ({ row }) => (
        <span className="md:text-md text-xs">${row.original.amount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "investment.profitPercent",
      header: () => <span className="md:text-md text-xs font-semibold">Profit %</span>,
      cell: ({ row }) => (
        <span className="md:text-md text-xs">{row.original.investment.profitPercent}%</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <span className="md:text-md text-xs font-semibold">Invested On</span>,
      cell: ({ row }) => (
        <span className="md:text-md text-xs">
          {formatDistanceToNow(new Date(row.original.createdAt))} ago
        </span>
      ),
    },
    // The actions column is no longer needed here as actions will be in the modal
    // You can remove the entire 'actions' column definition or comment it out.
    // For example, if you want to keep it for a different purpose later:
    /*
    {
      id: "actions",
      header: () => <span className="md:text-md text-xs font-semibold">Actions</span>,
      cell: ({ row }) => {
        // This cell could have a 'View Details' button if direct row click isn't preferred
        // For now, we assume row click handles opening the modal
        return (
            <Button variant="outline" size="sm" onClick={() => handleRowClick(row.original)}>
                View
            </Button>
        );
      },
    },
    */
  ];

  const tableInstance = useReactTable<UserInvestmentData>({
    data: data?.investments ?? [],
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
  if (!data?.investments.length) return <NoData />; 
  
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
                    onClick={() => handleRowClick(row.original)} // Make row clickable
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

      {selectedInvestment && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[525px] bg-background dark:bg-neutral-900 shadow-2xl rounded-lg">
            <DialogHeader className="pt-6 px-6">
              <DialogTitle className="text-2xl font-semibold dark:text-white">Investment Details</DialogTitle>
              <DialogDescription className="dark:text-neutral-400">
                Details for {selectedInvestment.user.fullName}'s investment.
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground dark:text-neutral-500">User</h3>
                <p className="text-lg font-semibold dark:text-white">{selectedInvestment.user.fullName}</p>
                <p className="text-sm text-muted-foreground dark:text-neutral-400">{selectedInvestment.user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground dark:text-neutral-500">Investment Plan</h3>
                <p className="text-lg dark:text-white">{selectedInvestment.investment.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground dark:text-neutral-500">Amount Invested</h3>
                <p className="text-lg dark:text-white">${selectedInvestment.amount.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground dark:text-neutral-500">Profit Percentage</h3>
                <p className="text-lg dark:text-white">{selectedInvestment.investment.profitPercent}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground dark:text-neutral-500">Invested On</h3>
                <p className="text-lg dark:text-white">{formatDistanceToNow(new Date(selectedInvestment.createdAt))} ago</p>
              </div>
            </div>
            <DialogFooter className="px-6 pb-6 sm:justify-start space-x-2">
              <Button
                variant="default"
                onClick={() => handleAddProfit(selectedInvestment.id)}
                disabled={pendingPayouts.has(selectedInvestment.id) || completedPayouts.has(selectedInvestment.id)}
                className="transition-all duration-150 ease-in-out hover:scale-105 active:scale-95"
              >
                {pendingPayouts.has(selectedInvestment.id)
                  ? "Sending Profit..."
                  : completedPayouts.has(selectedInvestment.id)
                  ? "Profit Sent"
                  : "Send Profit"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedInvestment.id)}
                disabled={deleteInvestmentMutation.isPending}
                className="transition-all duration-150 ease-in-out hover:scale-105 active:scale-95"
              >
                {deleteInvestmentMutation.isPending ? "Deleting..." : "Delete Investment"}
              </Button>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}  className="transition-all duration-150 ease-in-out hover:scale-105 active:scale-95">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
