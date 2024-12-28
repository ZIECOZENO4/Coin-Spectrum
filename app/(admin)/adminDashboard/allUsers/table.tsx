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
import { InvestmentStatusEnum, InvestmentPlanName } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useDataTableStore } from "@/lib/zuustand-store";
import { useInvestments } from "@/lib/tenstack-hooks/useInvestments";

interface DataTableProps {
  searchKey: string;
  page: number;
  sort: string;
  order: string;
}

import {
  User,
  Investment,
  InvestmentPlan,
  InvestmentStatus,
} from "@prisma/client";
import { useUsers } from "@/lib/tenstack-hooks/useAllUsers";
import NoData from "@/components/noData";

type UserResponse = User & {
  investments: (Investment & {
    plan: Pick<InvestmentPlan, "name">;
    status: InvestmentStatus | null;
  })[];
  confirmedInvestments: (Investment & {
    plan: Pick<InvestmentPlan, "name">;
    status: InvestmentStatus | null;
  })[];
  unconfirmedInvestments: (Investment & {
    plan: Pick<InvestmentPlan, "name">;
    status: InvestmentStatus | null;
  })[];
  totalConfirmedInvestmentAmount: number;
  totalUnconfirmedInvestmentAmount: number;
};

export function DataTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { width } = useWindowSize();
  const isSmallScreen = (width ?? 0) < 768; // Assuming 768px as the breakpoint for small screens
  const { search, setSearch, page, setPage, sort, setSort, order, setOrder } =
    useDataTableStore();
  const { data, isLoading, isError, error } = useUsers(page, sort, order);
  const { users } = data;
  const columns: ColumnDef<UserResponse, unknown>[] = [
    {
      id: "serialNumber",
      header: () => (
        <span className="md:text-md text-xs font-semibold">S/N</span>
      ),
      cell: ({ row }: { row: Row<UserResponse> }) => (
        <span className="md:text-md text-xs">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "fullName",
      header: () => (
        <span className="md:text-md text-xs font-semibold">User</span>
      ),
      cell: ({ row }: { row: Row<UserResponse> }) => (
        <span className="md:text-md text-xs">{row.original.userName}</span>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <span className="md:text-md text-xs font-semibold">Email</span>
      ),
      cell: ({ row }: { row: Row<UserResponse> }) => (
        <span className="md:text-md text-xs">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "totalConfirmedInvestmentAmount",
      header: () => (
        <span className="md:text-md text-xs font-semibold">
          Confirmed Investment Amount
        </span>
      ),
      cell: ({ row }: { row: Row<UserResponse> }) => (
        <span className="md:text-md text-xs">
          {row.original.totalConfirmedInvestmentAmount}
        </span>
      ),
    },
    {
      accessorKey: "totalUnconfirmedInvestmentAmount",
      header: () => (
        <span className="md:text-md text-xs font-semibold">
          Unconfirmed Investment Amount
        </span>
      ),
      cell: ({ row }: { row: Row<UserResponse> }) => (
        <span className="md:text-md text-xs">
          {row.original.totalUnconfirmedInvestmentAmount}
        </span>
      ),
    },
    isSmallScreen
      ? null
      : {
          accessorKey: "createdAt",
          header: () => (
            <span className="md:text-md text-xs font-semibold">Created At</span>
          ),
          cell: ({ row }: { row: Row<UserResponse> }) => (
            <span className="md:text-md text-xs">
              {formatDistanceToNow(new Date(row.original.createdAt), {
                addSuffix: true,
              })}
            </span>
          ),
        },
    isSmallScreen
      ? null
      : {
          accessorKey: "confirmedInvestment",
          header: () => (
            <span className="md:text-md text-xs font-semibold">confirmed</span>
          ),
          cell: ({ row }: { row: Row<UserResponse> }) => (
            <span className="md:text-md text-xs">
              {row.original.confirmedInvestments.length}
            </span>
          ),
        },
    isSmallScreen
      ? null
      : {
          accessorKey: "confirmedInvestment",
          header: () => (
            <span className="md:text-md text-xs font-semibold">
              unconfirmed
            </span>
          ),
          cell: ({ row }: { row: Row<UserResponse> }) => (
            <span className="md:text-md text-xs">
              {row.original.unconfirmedInvestments.length}
            </span>
          ),
        },
    isSmallScreen
      ? null
      : {
          accessorKey: "updatedAt",
          header: () => (
            <span className="md:text-md text-xs font-semibold">Updated At</span>
          ),
          cell: ({ row }: { row: Row<UserResponse> }) => (
            <span className="md:text-md text-xs">
              {formatDistanceToNow(new Date(row.original.updatedAt), {
                addSuffix: true,
              })}
            </span>
          ),
        },
  ].filter(Boolean) as ColumnDef<UserResponse, unknown>[]; // Ensure no null values and assert the correct type

  const table = useReactTable({
    data: data?.users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });
  if (data.users.length === 0) {
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
