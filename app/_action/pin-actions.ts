// app/actions/pin-actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { getUserAuth } from '@/lib/auth/utils'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { TransactionPinEmail } from '@/emails/TransactionPinEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

interface State {
  success: boolean,
  error: string | null,
  pending?: boolean
}

export async function updateUserPin(prevState: State, formData: FormData): Promise<State> {
  try {
    const { session } = await getUserAuth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const currentPin = formData.get('currentPin') as string | null;
    const newPin = formData.get('newPin') as string;
    const confirmPin = formData.get('confirmPin') as string;

    // Validation on the server
    if (newPin !== confirmPin) {
      return { success: false, error: "PINs do not match" };
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.transactionPin) { // Updating PIN, check the current PIN
      if (currentPin === null || currentPin !== user.transactionPin) {
        return { success: false, error: "Current PIN is incorrect" };
      }
    }


    // Uniqueness is now handled by the database constraint.
    // Update user transaction PIN
    await db.update(users)
      .set({ transactionPin: newPin })
      .where(eq(users.id, session.user.id));


    // Send email confirmation
    if (user.email) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "security@coinspectrum.net",
          to: user.email,
          subject: `Transaction PIN ${user.transactionPin ? 'Updated' : 'Created'}`,
          react: TransactionPinEmail({
            userName: user.firstName || user.email,
            pin: newPin,
            isUpdate: !!user.transactionPin,
            timestamp: new Date().toLocaleString()
          })
        });
      } catch (emailError: any) {
        console.error("Email sending failed:", emailError);
        return { success: false, error: `PIN updated but email failed: ${emailError.message || 'Unknown error'}` };
      }
    }

    revalidatePath('/security'); // Revalidate the settings page
    return { success: true, error: null };

  } catch (error: any) {
    console.error("PIN update error:", error);
      return { success: false, error: error.message || "An error occurred while updating PIN" };
  }
}
