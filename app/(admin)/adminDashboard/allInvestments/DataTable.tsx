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
    } catch (error) {
      console.error("Error deleting investment:", error);
    }
  };

  const handleAddProfit = async (userInvestmentId: string) => {
    // Add the ID to pending state
    setPendingPayouts(prev => new Set(prev).add(userInvestmentId));
    try {
      await addProfitMutation.mutateAsync(userInvestmentId, {
        onSuccess: () => {
          // On success, move from pending to completed
          setPendingPayouts(prev => {
            const newState = new Set(prev);
            newState.delete(userInvestmentId);
            return newState;
          });
          setCompletedPayouts(prev => new Set(prev).add(userInvestmentId));
        },
        onError: () => {
          // On error, remove from pending
           setPendingPayouts(prev => {
            const newState = new Set(prev);
            newState.delete(userInvestmentId);
            return newState;
          });
           // The mutation hook's onError already shows an alert
        }
      });
    } catch (error) {
      console.error("Error initiating add profit mutation:", error);
      // This catch block will primarily catch errors *before* the mutation function runs.
      // Errors from the API call itself are handled by the onError in mutateAsync options.
       setPendingPayouts(prev => {
        const newState = new Set(prev);
        newState.delete(userInvestmentId);
        return newState;
      });
    }
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
    {
      id: "actions",
      header: () => <span className="md:text-md text-xs font-semibold">Actions</span>,
      cell: ({ row }) => {
        const userInvestmentId = row.original.id;
        const isPayoutPending = pendingPayouts.has(userInvestmentId);
        const isPayoutCompleted = completedPayouts.has(userInvestmentId);

        return (
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAddProfit(userInvestmentId)}
              disabled={isPayoutPending || isPayoutCompleted} // Disable if pending or completed
            >
              {isPayoutPending ? "Sending..." : isPayoutCompleted ? "Profit Sent" : "Send Profit"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              disabled={deleteInvestmentMutation.isPending}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
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
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
    </div>
  );
}
