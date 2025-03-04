
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, MailCheck, MailWarning } from "lucide-react"
import { toast } from "sonner"

const ReferralListPage = () => {
  const [referrals, setReferrals] = useState<Array<any>>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [sendingEmails, setSendingEmails] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch('/api/myreferrals')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setReferrals(data)
      } catch (error) {
        toast.error('Failed to load referrals')
      } finally {
        setLoading(false)
      }
    }
    fetchReferrals()
  }, [])

  const handleSendThankYou = async (email: string) => {
    setSendingEmails(prev => ({ ...prev, [email]: true }))
    
    try {
      const response = await fetch('/api/myreferrals/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email })
      })

      if (!response.ok) throw new Error('Failed to send email')
      toast.success(`Thank you email sent to ${email}`)
    } catch (error) {
      toast.error(`Failed to send email to ${email}`)
    } finally {
      setSendingEmails(prev => ({ ...prev, [email]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-yellow-500 animate-spin" />
      </div>
    )
  }

  if (!referrals.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex flex-col items-center justify-center p-6"
      >
        <div className="text-center space-y-4">
          <MailWarning className="h-16 w-16 text-yellow-500 mx-auto" />
          <h1 className="text-2xl text-white font-bold">No Referrals Yet</h1>
          <p className="text-gray-400">
            Share your referral link to start growing your network!
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl text-yellow-500 font-bold">Your Referrals</h1>
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-yellow-500 hover:bg-gray-800"
          >
            ← Back
          </Button>
        </div>

        <div className="space-y-4">
          {referrals.map((referral, index) => (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="space-y-1">
                <h3 className="text-white font-medium">
                  {referral.fullName || "New User"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {referral.email} • Joined: {new Date(referral.createdAt).toLocaleDateString()}
                </p>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300">
                  {referral.status || 'Pending KYC'}
                </span>
              </div>
              
              <Button
                onClick={() => handleSendThankYou(referral.email)}
                disabled={sendingEmails[referral.email]}
                className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2"
              >
                {sendingEmails[referral.email] ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MailCheck className="h-4 w-4" />
                    Send Thanks
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ReferralListPage
