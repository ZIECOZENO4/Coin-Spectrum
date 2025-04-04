'use client'
import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { transferHistory } from '@/lib/db/schema'
import { toast } from 'sonner'
import { User } from '@/lib/db/schema'
import { sendTransferEmail } from '@/app/_action/email-actions'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

type TransferHistory = typeof transferHistory.$inferSelect & {
  sender: User
  receiver: User
  status: 'pending' | 'completed' | 'failed'
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function TransferHistoryTable() {
  const [transfers, setTransfers] = useState<TransferHistory[]>([])
  const [transfersToShow, setTransfersToShow] = useState(20)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransferHistory = async () => {
    try {
      const response = await fetch('/api/transfer-history')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch transfers')
      }

      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format')
      }

      setTransfers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transfers')
      toast.error('Failed to load transfer history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransferHistory()
  }, [])

  const handleViewMore = () => {
    setTransfersToShow(prev => prev + 20)
  }

  const handleSendEmail = async (transfer: TransferHistory, type: 'sender' | 'receiver') => {
    try {
      await sendTransferEmail(transfer, type)
      toast.success(`Email sent to ${type === 'sender' ? 'sender' : 'receiver'}`)
    } catch (error) {
      toast.error('Failed to send email')
    }
  }

  if (loading) return (
    <div className="rounded-lg border shadow-sm space-y-4 p-4">
      {Array(5).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full bg-gray-200/50 animate-pulse" />
      ))}
    </div>
  )

  if (error) return (
    <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600">
      <p>Error loading transfers: {error}</p>
      <Button 
        variant="outline" 
        className="mt-2 text-red-600 hover:bg-red-100"
        onClick={fetchTransferHistory}
      >
        Retry
      </Button>
    </div>
  )

  if (transfers.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 rounded-lg border border-dashed">
        No transfers yet
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg border border-gray-200 w-screen md:w-auto shadow-lg overflow-hidden"
    >
      <Table className="border-collapse w-full ">
        <TableHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-white font-semibold py-4">Date</TableHead>
            <TableHead className="text-white font-semibold">Sender</TableHead>
            <TableHead className="text-white font-semibold">Receiver</TableHead>
            <TableHead className="text-white font-semibold">Amount</TableHead>
            <TableHead className="text-white font-semibold">Status</TableHead>
            <TableHead className="text-white font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers
            .slice(0, transfersToShow)
            .map((transfer, index) => (
              <motion.tr
                key={transfer.id}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.05 }}
                className="group even:bg-gray-50 hover:bg-yellow-200 transition-colors duration-200"
              >

             <TableCell className="py-3 px-4 border-b text-yellow-300 border-gray-100">
               {new Date(transfer.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell className="font-medium py-3 px-4 border-b border-gray-100">
                <span className="text-gray-700">{transfer.sender.email}</span>
                <span className="block text-sm text-gray-500">({transfer.senderId})</span>
              </TableCell>
              <TableCell className="py-3 px-4 border-b border-gray-100">
                <span className="text-gray-700">{transfer.receiver.email}</span>
                <span className="block text-sm text-gray-500">({transfer.receiverId})</span>
              </TableCell>
              <TableCell className="py-3 px-4 border-b border-gray-100 font-semibold text-green-700">
                ${transfer.amount.toFixed(2)}
              </TableCell>
              <TableCell className="py-3 px-4 border-b border-gray-100">
                <Badge 
                  variant={
                    transfer.status === 'completed' ? 'default' : 
                    transfer.status === 'pending' ? 'secondary' : 'destructive'
                  }
                  className="animate-pulse"
                >
                  {transfer.status}
                </Badge>
              </TableCell>

             <TableCell className="py-3 px-4 border-b border-gray-100">
                              <div className="flex gap-2">
                                <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-yellow-100 hover:text-yellow-800 transition-colors"
                    onClick={() => handleSendEmail(transfer, 'sender')}
                  >
                    📧 Sender
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-yellow-100 hover:text-yellow-800 transition-colors"
                    onClick={() => handleSendEmail(transfer, 'receiver')}
                  >
                    📧 Receiver
                  </Button>
                </div>
              </TableCell>
              
              </motion.tr>
            ))}
        </TableBody>
      </Table>

      {transfersToShow < transfers.length && (
        <div className="p-4 flex justify-center border-t">
          <Button
            variant="outline"
            className="hover:bg-yellow-100 hover:text-yellow-800"
            onClick={handleViewMore}
          >
            View More ({transfers.length - transfersToShow} remaining)
          </Button>
        </div>
      )}
    </motion.div>
  )
}
