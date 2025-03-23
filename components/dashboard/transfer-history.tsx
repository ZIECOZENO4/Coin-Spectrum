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

type TransferHistory = typeof transferHistory.$inferSelect & {
  sender: User
  receiver: User
  status: 'pending' | 'completed' | 'failed'
}

export function TransferHistoryTable() {
  const [transfers, setTransfers] = useState<TransferHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransferHistory = async () => {
    try {
      const response = await fetch('/api/transfer-history')
      if (!response.ok) throw new Error('Failed to fetch transfers')
      const data = await response.json()
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

  const handleSendEmail = async (transfer: TransferHistory, type: 'sender' | 'receiver') => {
    try {
      await sendTransferEmail(transfer, type)
      toast.success(`Email sent to ${type === 'sender' ? 'sender' : 'receiver'}`)
    } catch (error) {
      toast.error('Failed to send email')
    }
  }

  if (loading) return <div>Loading transfer history...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="rounded-lg border text-black w-auto shadow-sm">
      <Table>
        <TableHeader className="bg-yellow-600">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Receiver</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.map((transfer) => (
            <TableRow key={transfer.id} className="hover:bg-yellow-300 transition-colors">
              <TableCell>
                {new Date(transfer.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">
                {transfer.sender.email} ({transfer.senderId})
              </TableCell>
              <TableCell>
                {transfer.receiver.email} ({transfer.receiverId})
              </TableCell>
              <TableCell>${transfer.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={
                  transfer.status === 'completed' ? 'default' : 
                  transfer.status === 'pending' ? 'secondary' : 'destructive'
                }>
                  {transfer.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSendEmail(transfer, 'sender')}
                  >
                    Email Sender
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSendEmail(transfer, 'receiver')}
                  >
                    Email Receiver
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
