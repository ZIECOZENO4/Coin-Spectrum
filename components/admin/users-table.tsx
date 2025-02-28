// components/admin/users-table.tsx
"use client";
import { useState, useEffect } from 'react';
import { User } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { toast } from 'sonner';

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/adminusers');
        const data = await response.json();
        if (data.success) setUsers(data.users);
      } catch (error) {
        toast.success('Failed to load users!');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateBalance = async (userId: string, newBalance: number) => {
    setUpdating(userId);
    try {
      const response = await fetch(`/api/users/${userId}/balance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: newBalance })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setUsers(users.map(user => 
        user.id === userId ? { ...user, balance: newBalance } : user
      ));
        toast.success('Balance updated successfully!');
    } catch (error) {
      toast.error('Update failed!');
    } finally {
      setUpdating(null);
    }
  };

  const columns: ColumnDef<User>[] = [
    { header: 'Username', accessorKey: 'username' },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Current Balance',
      accessorKey: 'balance',
      cell: ({ row }) => (
        <div className="font-medium">
          ${Number(row.original.balance).toLocaleString()}
        </div>
      )
    },
    {
      header: 'New Balance',
      cell: ({ row }) => {
        const [newBalance, setNewBalance] = useState(row.original.balance.toString());
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className="w-32"
            />
            <Button
              onClick={() => handleUpdateBalance(row.original.id, parseFloat(newBalance))}
              disabled={updating === row.original.id}
            >
              {updating === row.original.id ? "Updating..." : "Update"}
            </Button>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="rounded-md border text-sm md:text-xl">
      <table className="w-full">
        <thead className="bg-muted">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-2 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
