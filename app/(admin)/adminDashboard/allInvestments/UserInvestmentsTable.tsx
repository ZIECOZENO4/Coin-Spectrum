// app/admin/investments/UserInvestmentsTable.tsx
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
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";

interface UserInvestmentsTableProps {
  search: string;
}

export function UserInvestmentsTable({ search }: UserInvestmentsTableProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["userInvestments", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
      });
      const res = await fetch(`/api/user-investments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) return <div className="text-white"><Loading /></div>;

  return (
    <div className="bg-yellow-50 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-yellow-100">
          <TableRow>
            <TableHead className="text-black font-bold">User</TableHead>
            <TableHead className="text-black font-bold">Investment</TableHead>
            <TableHead className="text-black font-bold">Amount</TableHead>
            <TableHead className="text-black font-bold">Date</TableHead>
            <TableHead className="text-black font-bold">Actions</TableHead> {/* Added Actions Header */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.investments.map((item: any) => (
            <TableRow key={item.id} className="hover:bg-yellow-100">
              <TableCell className="text-black">
                <div className="flex flex-col">
                  <span className="font-medium">{item.user.fullName}</span>
                  <span className="text-sm text-gray-600">{item.user.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-black font-medium">
                {item.investment.name}
              </TableCell>
              <TableCell className="text-black">
                ${item.amount.toLocaleString()}
              </TableCell>
              <TableCell className="text-black">
                {formatDistanceToNow(new Date(item.createdAt))} ago
              </TableCell>
              <TableCell className="text-black"> {/* Added Actions Cell */}
                <Button 
                   variant="outline" 
                   size="sm"
                   className="bg-black text-yellow-50 hover:bg-gray-700"
                   onClick={() => console.log("View details for:", item.id)} // Placeholder action
                >
                   View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-4 bg-yellow-100">
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
