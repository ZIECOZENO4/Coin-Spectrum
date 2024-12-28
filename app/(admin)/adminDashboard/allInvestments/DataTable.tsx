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
import { InvestmentStatusEnum, InvestmentPlan, Wallets } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useDataTableStore } from "@/lib/zuustand-store";

import {
  Investment,
  InvestmentStatus,
  User,
} from "@prisma/client";
import { useInvestments } from "@/lib/tenstack-hooks/useInvestments";
import NoData from "../../../../components/noData";

// Define the shape of the data returned by useInvestments
type InvestmentResponseFromHook = Investment & {
  user: User;
  plan: Pick<InvestmentPlan, "name">;
  status: {
    status: InvestmentStatus["status"] | null;
  } | null;
};

// Define the shape we want to use in our component
type InvestmentResponse = InvestmentResponseFromHook;

export function DataTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { width } = useWindowSize();
  const isSmallScreen = (width ?? 0) < 768;
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
    planFilter,
    setPlanFilter,
  } = useDataTableStore();
  const { data, isLoading, isError, error } = useInvestments(
    page,
    sort,
    order,
    search,
    statusFilter,
    planFilter
  );
  const investments = data?.investments || [];

  const columns: ColumnDef<InvestmentResponse, any>[] = [
    {
      id: "serialNumber",
      header: () => (
        <span className="md:text-md text-xs font-semibold">S/N</span>
      ),
      cell: ({ row }) => (
        <span className="md:text-md text-xs">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "user.fullName",
      header: () => (
        <span className="md:text-md text-xs font-semibold">User</span>
      ),
      cell: ({ row }) => (
        <Link
          href={`/adminDashboard/oneInvestment?id=${row.original.id}&userId=${row.original.userId}`}
          className="md:text-md text-xs"
        >
          {row.original.user.userName}
        </Link>
      ),
    },
    {
      accessorKey: "plan.name",
      header: () => (
        <span className="md:text-md text-xs font-semibold">Plan</span>
      ),
      cell: ({ row }) => (
        <Link
          href={`/adminDashboard/oneInvestment?id=${row.original.id}`}
          className="md:text-md text-xs"
        >
          {row.original.plan.name}
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <span className="md:text-md text-xs font-semibold">Status</span>
      ),
      cell: ({ row }) => {
        const status = row.original.status?.status;
        const badgeClasses = cn("md:text-md text-xxs", {
          "bg-gray-100 text-green-500":
            status === InvestmentStatusEnum.PAYMENT_MADE,
          "bg-blue-100 text-blue-500 animate-pulse":
            status === InvestmentStatusEnum.NOT_CONFIRMED,
          "bg-green-100 text-red-500 animate-pulse":
            status === InvestmentStatusEnum.CONFIRMED,
          "bg-yellow-100 text-red-500 animate-pulse":
            status === InvestmentStatusEnum.SOLD,
        });

        return <Badge className={badgeClasses}>{status}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <span className="md:text-md text-xs font-semibold">Created At</span>
      ),
      cell: ({ row }) => (
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
      cell: ({ row }) => (
        <span className="md:text-md text-xs">
          {formatDistanceToNow(new Date(row.original.updatedAt))}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: investments as InvestmentResponse[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  if (investments.length === 0) {
    return <NoData />;
  }
  return (
    <div>
      <div className="flex flex-col items-center justify-between">
        <div className="w-full overflow-x-auto">
          <div className=" rounded-md">
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
