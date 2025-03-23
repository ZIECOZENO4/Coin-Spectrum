// // components/transfer-history.tsx
// 'use client'
// import { useState } from 'react'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { transferHistory } from '@/lib/db/schema'
// import { toast } from 'sonner'
// import { User } from '@/lib/db/schema'
// import { sendTransferEmail } from '@/app/_action/email-actions'

// // Define proper TypeScript type based on schema
// type TransferHistory = typeof transferHistory.$inferSelect & {
//   sender: User
//   receiver: User
//   status: 'pending' | 'completed' | 'failed' // Add explicit status type
// }

// export function TransferHistoryTable({ data }: { data: TransferHistory[] }) {
//   const [selectedTransfer, setSelectedTransfer] = useState<TransferHistory | null>(null)

//   const handleSendEmail = async (transfer: TransferHistory, type: 'sender' | 'receiver') => {
//     try {
//       await sendTransferEmail(transfer, type)
//       toast.success(`Email sent to ${type === 'sender' ? 'sender' : 'receiver'}`)
//     } catch (error) {
//       toast.error('Failed to send email')
//     }
//   }

//   return (
//     <div className="rounded-lg border text-black w-auto shadow-sm">
//       <Table>
//         <TableHeader className="bg-yellow-600">
//           <TableRow>
//             <TableHead>Date</TableHead>
//             <TableHead>Sender</TableHead>
//             <TableHead>Receiver</TableHead>
//             <TableHead>Amount</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.map((transfer) => (
//             <TableRow key={transfer.id} className="hover:bg-yellow-300 transition-colors">
//               <TableCell>
//                 {new Date(transfer.createdAt).toLocaleDateString()}
//               </TableCell>
//               <TableCell className="font-medium">
//                 {transfer.sender.email} ({transfer.senderId})
//               </TableCell>
//               <TableCell>
//                 {transfer.receiver.email} ({transfer.receiverId})
//               </TableCell>
//               <TableCell>${transfer.amount.toFixed(2)}</TableCell>
//               <TableCell>
//                 <Badge variant={
//                   transfer.status === 'completed' ? 'default' : 
//                   transfer.status === 'pending' ? 'secondary' : 'destructive'
//                 }>
//                   {transfer.status}
//                 </Badge>
//               </TableCell>
//               <TableCell>
//                 <div className="flex gap-2">
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => handleSendEmail(transfer, 'sender')}
//                   >
//                     Email Sender
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => handleSendEmail(transfer, 'receiver')}
//                   >
//                     Email Receiver
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }

// components/transfer-history.tsx
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

// components/transfer-history.tsx
const fetchTransferHistory = async () => {
  try {
    const response = await fetch('/api/transfer-history');
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[TRANSFER-UI] API error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch transfers');
    }

    const data = await response.json();
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    setTransfers(data);

  } catch (err) {
    console.error('[TRANSFER-UI] Fetch error:', err);
    setError(err instanceof Error ? err.message : 'Failed to fetch transfers');
    toast.error('Failed to load transfer history');
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    fetchTransferHistory()
  }, [])

  const handleSendEmail = async (transfer: TransferHistory, type: 'sender' | 'receiver') => {
    try {
      console.log(`[TRANSFER-UI] Sending email to ${type}:`, transfer);
      await sendTransferEmail(transfer, type)
      toast.success(`Email sent to ${type === 'sender' ? 'sender' : 'receiver'}`)
    } catch (error) {
      console.error('[TRANSFER-UI] Email error:', error);
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg border border-gray-200 shadow-lg overflow-hidden"
    >
      <Table className="border-collapse w-full">
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
          {transfers.map((transfer, index) => (
            <motion.tr
              key={transfer.id}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              className="group even:bg-gray-50 hover:bg-yellow-50 transition-colors duration-200"
            >
              <TableCell className="py-3 px-4 border-b border-gray-100">
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
    </motion.div>
  )
}
