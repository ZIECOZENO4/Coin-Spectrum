// app/admin/transaction-pins/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { User } from '@/lib/db/schema'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function AdminTransactionPins() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/transaction-pins')
        const data = await response.json()
        if (data.success) setUsers(data.users)
        else toast.error('Failed to load users')
      } catch (error) {
        toast.error('Network error loading users')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleUpdatePin = async (userId: string, newPin: string) => {
    if (!/^\d{4}$/.test(newPin)) {
      toast.error('PIN must be 4 digits')
      return
    }

    setUpdating(userId)
    try {
      const response = await fetch(`/api/admin/transaction-pins/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: newPin })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setUsers(users.map(user => 
        user.id === userId ? { ...user, transactionPin: newPin } : user
      ))
      toast.success('PIN updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Update failed')
    } finally {
      setUpdating(null)
    }
  }

  const columns: ColumnDef<User>[] = [
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Current PIN',
      accessorKey: 'transactionPin',
      cell: ({ row }) => (
        <div className="font-mono">
          {row.original.transactionPin || 'Not set'}
        </div>
      )
    },
    {
      header: 'New PIN',
      cell: ({ row }) => {
        const [newPin, setNewPin] = useState(row.original.transactionPin || '')
        return (
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0,4))}
              className="w-32"
              inputMode="numeric"
            />
            <Button
              onClick={() => handleUpdatePin(row.original.id, newPin)}
              disabled={updating === row.original.id || newPin.length !== 4}
            >
              {updating === row.original.id ? "Updating..." : "Update"}
            </Button>
          </div>
        )
      }
    }
  ]

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) return <div className="p-4">Loading users...</div>

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transaction PIN Management</h1>
      <div className="rounded-md border">
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
              <tr key={row.id} className="border-t hover:bg-muted/50">
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
    </div>
  )
}
