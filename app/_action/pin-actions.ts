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

export async function updateUserPin(
  hasExistingPin: boolean,
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const { session } = await getUserAuth()
    if (!session?.user?.id) return { success: false, error: "Unauthorized" }

    const currentPin = formData.get('currentPin') as string
    const newPin = formData.get('pin') as string
    const confirmPin = formData.get('confirmPin') as string

    // Server-side validation
    if (!/^\d{4}$/.test(newPin)) return { success: false, error: "PIN must be 4 digits" }
    if (newPin !== confirmPin) return { success: false, error: "PINs do not match" }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    })

    if (!user) return { success: false, error: "User not found" }
    
    // Verify current PIN only when updating
    if (hasExistingPin) {
      if (!currentPin) return { success: false, error: "Current PIN required" }
      if (currentPin !== user.transactionPin) {
        return { success: false, error: "Current PIN is incorrect" }
      }
    }

    // Update database
    await db.update(users)
      .set({ transactionPin: newPin })
      .where(eq(users.id, session.user.id))

    // Send confirmation email
    if (user.email) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'security@yourdomain.com',
        to: user.email,
        subject: `Transaction PIN ${hasExistingPin ? 'Updated' : 'Created'}`,
        react: TransactionPinEmail({
          userName: user.firstName || user.email,
          pin: newPin,
          isUpdate: hasExistingPin
        })
      })
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error("PIN update error:", error)
    return { 
      success: false, 
      error: error.message || "An error occurred while updating PIN" 
    }
  }
}
