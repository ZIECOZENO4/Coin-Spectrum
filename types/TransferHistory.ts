export type TransferHistory = {
    id: string
    senderId: string
    senderEmail: string
    receiverId: string
    receiverEmail: string
    amount: number
    status: 'pending' | 'completed' | 'failed'
    createdAt: Date
    updatedAt: Date
  }
  