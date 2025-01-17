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
import { Header, HeaderGroup, Row, Cell } from '@tanstack/react-table';
import { Investment } from '@/lib/db/schema';
import { 
  Table as TableInstance
} from '@tanstack/react-table';

type UserInvestmentData = {
  id: string;
  userId: string;
  user: {
    fullName: string;
    email: string;
  };
  investment: {
    id: string;
    name: string;
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

  const handleDelete = async (id: string) => {
    try {
      await deleteInvestmentMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting investment:", error);
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
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(row.original.id)}
          disabled={deleteInvestmentMutation.isPending}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!data?.investments.length) return <NoData />;
  
  return (
    <div>
      <div className="flex flex-col items-center justify-between">
        <div className="w-full overflow-x-auto">
          <div className="rounded-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<Investment>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header: Header<Investment, unknown>) => (
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
                {table.getRowModel().rows.map((row: Row<Investment>) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell: Cell<Investment, unknown>) => (
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
