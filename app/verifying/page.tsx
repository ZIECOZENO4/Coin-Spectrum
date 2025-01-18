// app/verifying/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

interface KYCStatus {
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  submissionDate: string
}

export default function VerifyingPage() {
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { userId } = useAuth()

  useEffect(() => {
    const fetchKYCStatus = async () => {
      try {
        const response = await fetch(`/api/kyc/status`)
        if (!response.ok) throw new Error('Failed to fetch KYC status')
        const data = await response.json()
        setKycStatus(data)
      } catch (error) {
        console.error('Error fetching KYC status:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchKYCStatus()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  const renderStatusContent = () => {
    switch (kycStatus?.status) {
      case 'approved':
        return (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-700">KYC Approved!</h2>
            <p className="text-gray-600">
              Your identity has been verified successfully. You now have full access to all features.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Go to Dashboard
            </button>
          </div>
        )

      case 'rejected':
        return (
          <div className="text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-red-700">KYC Rejected</h2>
            <p className="text-gray-600">
              Unfortunately, your KYC submission was not approved.
            </p>
            {kycStatus.notes && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-700">Reason: {kycStatus.notes}</p>
              </div>
            )}
            <button
              onClick={() => router.push('/kyc')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Submit Again
            </button>
          </div>
        )

      case 'pending':
        return (
          <div className="text-center space-y-4">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto animate-pulse" />
            <h2 className="text-2xl font-bold text-yellow-700">KYC Under Review</h2>
            <p className="text-gray-600">
              Your KYC submission is currently being reviewed. This usually takes 24-48 hours.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-700">
                Submission Date: {new Date(kycStatus.submissionDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center space-y-4">
            <p className="text-gray-600">No KYC submission found.</p>
            <button
              onClick={() => router.push('/kyc')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit KYC
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="p-8">{renderStatusContent()}</Card>
      </div>
    </div>
  )
}
