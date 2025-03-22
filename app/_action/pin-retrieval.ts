// app/_action/pin-actions.ts
'use server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { getUserAuth } from '@/lib/auth/utils'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { TransactionPinEmail } from '@/emails/TransactionPinEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

interface State {
  success: boolean
  error: string | null
}

interface RetrievalState extends State {
  success: boolean
  error: string | null
}

export async function requestPinRetrieval(
  prevState: RetrievalState,
  formData: FormData
): Promise<RetrievalState> {
  try {
    const { session } = await getUserAuth()
    if (!session?.user?.id) return { success: false, error: "Unauthorized" }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    })

    if (!user?.email) return { success: false, error: "User email not found" }

    const message = formData.get('message') as string
    if (!message) return { success: false, error: "Please provide a reason" }

    // Send email to admin
    await resend.emails.send({
      from: user.email || 'support@coinspectrum.net',
      to: process.env.ADMIN_EMAIL || 'admin@coinspectrum.net',
      subject: `PIN Retrieval Request - ${user.email}`,
      text: `
        User Email: ${user.email}
        Request Time: ${new Date().toISOString()}
        Message: ${message}
        
        Please review this PIN retrieval request and contact the user directly.
      `
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: process.env.NOREPLY_EMAIL || 'noreply@coinspectrum.net',
      to: user.email,
      subject: 'PIN Retrieval Request Received',
      text: `
        Hi ${user.firstName || 'there'},

        We've received your PIN retrieval request with the following details:
        
        Request Time: ${new Date().toISOString()}
        Your Message: ${message}

        Our admin team will review your request and contact you shortly.

        Thank you,
        Coinspectrum Team
      `
    })

    return { success: true, error: null }
  } catch (error: any) {
    console.error("PIN retrieval error:", error)
    return { 
      success: false, 
      error: error.message || "Failed to submit request" 
    }
  }
}


  