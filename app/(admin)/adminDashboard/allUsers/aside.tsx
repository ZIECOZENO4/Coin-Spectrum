// app/admin/users/UsersTable.tsx
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Loading from "@/app/loading";

interface UsersTableProps {
  search: string;
}

export function UsersTable({ search }: UsersTableProps) {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newBalance, setNewBalance] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), search });
      const res = await fetch(`/api/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, balance }: { id: string; balance: number }) => {
      const res = await fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({ id, balance }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUser(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) return <div className="text-white"><Loading /></div>;

  return (
    <>
      <div className="bg-yellow-50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-yellow-100">
            <TableRow>
              <TableHead className="text-black font-bold">User</TableHead>
              <TableHead className="text-black font-bold">Balance</TableHead>
              <TableHead className="text-black font-bold">Role</TableHead>
              <TableHead className="text-black font-bold">Country</TableHead>
              <TableHead className="text-black font-bold">Joined</TableHead>
              <TableHead className="text-black font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users.map((user: any) => (
              <TableRow key={user.id} className="hover:bg-yellow-100">
                <TableCell className="text-black">
                  <div className="flex flex-col">
                    <span className="font-medium">{user.fullName}</span>
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-black">
                  ${user.balance.toLocaleString()}
                </TableCell>
                <TableCell className="text-black">{user.role}</TableCell>
                <TableCell className="text-black">{user.country || "N/A"}</TableCell>
                <TableCell className="text-black">
                  {formatDistanceToNow(new Date(user.createdAt))} ago
                </TableCell>
                <TableCell>
                  <div className="space-x-2 flex gap-8">
                    <Button
                      onClick={() => setSelectedUser(user)}
                      className="bg-black text-yellow-50 hover:bg-gray-800"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => deleteMutation.mutate(user.id)}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-black text-white">
          <DialogHeader>
            <DialogTitle>Update User Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder="New Balance"
              className="bg-yellow-50 text-black"
            />
            <Button
              onClick={() => {
                updateMutation.mutate({
                  id: selectedUser.id,
                  balance: parseFloat(newBalance),
                });
              }}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Update Balance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
