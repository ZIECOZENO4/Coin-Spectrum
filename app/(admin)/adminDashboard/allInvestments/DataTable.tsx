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
import { useInvestments } from "@/lib/tenstack-hooks/useInvestments";
import NoData from "../../../../components/noData";

type Investment = {
  id: string;
  name: string;
  price: number;
  profitPercent: number;
  rating: number;
  principalReturn: boolean;
  principalWithdraw: boolean;
  creditAmount: number;
  depositFee: string;
  debitAmount: number;
  durationDays: number;
  createdAt: string;
  updatedAt: string;
};

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  const investments = data?.investments || [];

  const columns: ColumnDef<InvestmentData>[] = [
    {
      id: "serialNumber",
      header: () => <span className="md:text-md text-xs font-semibold">S/N</span>,
      cell: ({ row }) => <span className="md:text-md text-xs">{row.index + 1}</span>,
    },
    {
      accessorKey: "name",
      header: () => <span className="md:text-md text-xs font-semibold">Name</span>,
      cell: ({ row }) => (
        <Link
          href={`/adminDashboard/oneInvestment?id=${row.original.id}`}
          className="md:text-md text-xs"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "price",
      header: () => <span className="md:text-md text-xs font-semibold">Price</span>,
      cell: ({ row }) => (
        <span className="md:text-md text-xs">
          ${row.original.price.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "profitPercent",
      header: () => <span className="md:text-md text-xs font-semibold">Profit %</span>,
      cell: ({ row }) => (
        <span className="md:text-md text-xs">
          {row.original.profitPercent}%
        </span>
      ),
    },
    {
      accessorKey: "durationDays",
      header: () => <span className="md:text-md text-xs font-semibold">Duration</span>,
      cell: ({ row }) => (
        <span className="md:text-md text-xs">
          {row.original.durationDays} days
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <span className="md:text-md text-xs font-semibold">Created</span>,
      cell: ({ row }) => (
        <span className="md:text-md text-xs">
          {formatDistanceToNow(new Date(row.original.createdAt))} ago
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: investments,
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
          <div className="rounded-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
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
