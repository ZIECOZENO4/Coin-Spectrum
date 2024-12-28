// DataTable.tsx
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
  Row,
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
import { WithdrawalStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useWithdrawalDataTableStore } from "@/lib/zuustand-store";
import { Withdrawal, User } from "@prisma/client";
import { formatCurrencyNaira } from "@/lib/formatCurrency";
import { useWithdrawals } from "@/lib/tenstack-hooks/useAllWithdrawal";
import NoData from "@/components/noData";

type WithdrawalResponse = Withdrawal & {
  user: User;
  createdAt: string;
  updatedAt: string;
};

export function DataTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { width } = useWindowSize();
  const isSmallScreen = (width ?? 0) < 768; // Assuming 768px as the breakpoint for small screens
  const {
    search,
    setSearch,
    page,
    setPage,
    sort,
    setSort,
    order,
    setOrder,
    statusFilter,
    setStatusFilter,
  } = useWithdrawalDataTableStore();
  const { data, isLoading, isError, error } = useWithdrawals(
    page,
    sort,
    order,
    search,
    statusFilter
  );
  const { withdrawals } = data;
  const columns: ColumnDef<WithdrawalResponse, unknown>[] = [
    {
      id: "serialNumber",
      header: () => (
        <span className="md:text-md text-xs font-semibold">S/N</span>
      ),
      cell: ({ row }: { row: Row<WithdrawalResponse> }) => (
        <span className="md:text-md text-xs">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "user.fullName",
      header: () => (
        <span className="md:text-md text-xs font-semibold">User</span>
      ),
      cell: ({ row }: { row: Row<WithdrawalResponse> }) => (
        <Link
          href={`/adminDashboard/oneWithdrawal?id=${row.original.id}`}
          className="md:text-md text-xs"
        >
          {row.original.user.userName}
        </Link>
      ),
    },
    {
      accessorKey: "amount",
      header: () => (
        <span className="md:text-md text-xs font-semibold">Amount</span>
      ),
      cell: ({ row }: { row: Row<WithdrawalResponse> }) => (
        <span className="md:text-md text-xs">
          {formatCurrencyNaira(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <span className="md:text-md text-xs font-semibold">Status</span>
      ),
      cell: ({ row }: { row: Row<WithdrawalResponse> }) => {
        const status = row.original.status;
        const badgeClasses = cn("md:text-md text-xxs", {
          "bg-gray-100 text-green-500": status === WithdrawalStatus.CONFIRMED,
          "bg-blue-100 text-blue-500 animate-pulse":
            status === WithdrawalStatus.UNCONFIRMED,
        });

        return <Badge className={badgeClasses}>{status}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <span className="md:text-md text-xs font-semibold">Created At</span>
      ),
      cell: ({ row }: { row: Row<WithdrawalResponse> }) => (
        <span className="md:text-md text-xs">
          {formatDistanceToNow(new Date(row.original.createdAt))}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: () => (
        <span className="md:text-md text-xs font-semibold">Updated At</span>
      ),
      cell: ({ row }: { row: Row<WithdrawalResponse> }) => (
        <span className="md:text-md text-xs">
          {formatDistanceToNow(new Date(row.original.updatedAt))}
        </span>
      ),
    },
  ].filter(Boolean) as ColumnDef<WithdrawalResponse, unknown>[]; // Ensure no null values and assert the correct type

  const table = useReactTable({
    data: data?.withdrawals || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });
  if (data.withdrawals.length === 0) {
    return <NoData />;
  }
  return (
    <div>
      <div className="flex flex-col items-center justify-between">
        <div className="w-full overflow-x-auto">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
              onClick={() => {
                const newPage = Math.max(page - 1, 1);
                setPage(newPage); // Update the page state
              }}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newPage = Math.min(page + 1, data?.totalPages || 1);
                setPage(newPage); // Update the page state
              }}
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
