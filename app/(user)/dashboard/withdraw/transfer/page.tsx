// app/transfer/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { User } from '@/lib/db/schema'
import { TransferHistoryTable } from '@/components/dashboard/transfer-history'
import { getUserAuth } from '@/lib/auth/utils'

export default function TransferPage() {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState<string[]>(Array(4).fill(''))
  const [recipient, setRecipient] = useState<User | null>(null)
  const [showPinModal, setShowPinModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transferHistory, setTransferHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)

  const handleSearchRecipient = async () => {
    if (!recipientEmail.includes('@')) return
    
    try {
      const response = await fetch(`/api/transfer/recipient?email=${encodeURIComponent(recipientEmail)}`)
      const data = await response.json()
      
      if (data.success) {
        setRecipient(data.user)
        toast.success('Recipient verified')
      } else {
        toast.error('User not found')
        setRecipient(null)
      }
    } catch (error) {
      toast.error('Error searching user')
    }
  }

  useEffect(() => {
    const fetchTransferHistory = async () => {
      try {
        const { session } = await getUserAuth()
        if (!session?.user?.id) return

        const response = await fetch(`/api/transfersHistory?userId=${session.user.id}`)
        const data = await response.json()
        
        if (data.success) {
          setTransferHistory(data.transfers)
        }
      } catch (error) {
        toast.error('Failed to load transfer history')
      } finally {
        setHistoryLoading(false)
      }
    }
    
    fetchTransferHistory()
  }, [])

  const handleTransfer = async () => {
    if (!recipient || !amount) return
    if (Number(amount) <= 0) {
      toast.error('Invalid amount')
      return
    }
    setShowPinModal(true)
  }

  const confirmTransfer = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          amount: Number(amount),
          pin: pin.join('')
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Transfer successful!')
        setRecipientEmail('')
        setAmount('')
      } else {
        toast.error(data.error || 'Transfer failed')
      }
    } catch (error) {
      toast.error('Transfer failed')
    } finally {
      setLoading(false)
      setShowPinModal(false)
      setPin(Array(4).fill(''))
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Transfer Funds</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Recipient Email</label>
          <Input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            onBlur={handleSearchRecipient}
            placeholder="Enter recipient email"
          />
          {recipient && (
            <div className="mt-2 p-3 bg-muted rounded">
              {recipient.firstName} {recipient.lastName} (@{recipient.username})
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2">Amount</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <Button 
          onClick={handleTransfer}
          disabled={!recipient || !amount}
          className="w-full"
        >
          Initiate Transfer
        </Button>
      </div>

    

      <div className='text-black  my-8 gap-4 w-auto container'>
        <h2 className="text-xl font-bold mb-4">Your Transfer History</h2>
        {historyLoading ? (
          <div className="p-4 text-center text-gray-500">Loading history...</div>
        ) : transferHistory.length > 0 ? (
          <TransferHistoryTable data={transferHistory} />
        ) : (
          <div className="p-4 text-center text-gray-500">
            No transfer history found. Transactions will appear here after you make transfers.
          </div>
        )}
      </div>
 

      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction PIN</DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-2 justify-center">
            {pin.map((digit, i) => (
              <Input
                key={i}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const newPin = [...pin]
                  newPin[i] = e.target.value.replace(/\D/g, '')
                  setPin(newPin)
                  if (e.target.value && i < 3) {
                    document.getElementById(`pin-${i+1}`)?.focus()
                  }
                }}
                id={`pin-${i}`}
                className="w-12 text-center"
              />
            ))}
          </div>

          <Button 
            onClick={confirmTransfer}
            disabled={loading || pin.join('').length !== 4}
          >
            {loading ? 'Processing...' : 'Confirm Transfer'}
          </Button>
        </DialogContent>
      </Dialog>
  
    </div>
  )
}
