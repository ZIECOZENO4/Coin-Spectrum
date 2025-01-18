// app/admin/signal-purchases/page.tsx
"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { formatDistanceToNow } from "date-fns";
import { useDebounce } from "@/hook/useDebounce";


export default function SignalPurchasesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["signalPurchases", page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        search: debouncedSearch,
      });
      const res = await fetch(`/api/admin/signal-purchases?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/signal-purchases?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signalPurchases"] });
    },
  });

  if (isLoading) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Signal Purchases</h1>
          <Input
            placeholder="Search by user or signal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-yellow-50 text-black placeholder:text-gray-500"
          />
        </div>

        <div className="bg-yellow-50 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-yellow-100">
              <TableRow>
                <TableHead className="text-black font-bold">User</TableHead>
                <TableHead className="text-black font-bold">Signal</TableHead>
                <TableHead className="text-black font-bold">Amount</TableHead>
                <TableHead className="text-black font-bold">Status</TableHead>
                <TableHead className="text-black font-bold">Purchased</TableHead>
                <TableHead className="text-black font-bold">Expires</TableHead>
                <TableHead className="text-black font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.purchases.map((item: any) => (
                <TableRow key={item.purchase.id} className="hover:bg-yellow-100">
                  <TableCell className="text-black">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.user.fullName}</span>
                      <span className="text-sm text-gray-600">{item.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-black">{item.signal.name}</TableCell>
                  <TableCell className="text-black">
                    ${item.purchase.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-black">{item.purchase.status}</TableCell>
                  <TableCell className="text-black">
                    {formatDistanceToNow(new Date(item.purchase.purchasedAt))} ago
                  </TableCell>
                  <TableCell className="text-black">
                    {formatDistanceToNow(new Date(item.purchase.expiresAt))}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => deleteMutation.mutate(item.purchase.id)}
                      className="bg-red-600 text-white hover:bg-red-700"
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-white">
            Page {page} of {data?.totalPages || 1}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(p + 1, data?.totalPages || 1))}
              disabled={page === data?.totalPages}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
