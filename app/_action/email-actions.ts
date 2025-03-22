// actions/email-actions.ts
'use server'
import { TransferEmailTemplate } from '@/emails/email-template'
import { Resend } from 'resend'
import type { User, transferHistory } from '@/lib/db/schema'

const resend = new Resend(process.env.RESEND_API_KEY)

type TransferWithUsers = typeof transferHistory.$inferSelect & {
  sender: Pick<User, 'email' | 'firstName' | 'lastName'>,
  receiver: Pick<User, 'email' | 'firstName' | 'lastName'>
}

export async function sendTransferEmail(
  transfer: TransferWithUsers, 
  type: 'sender' | 'receiver'
) {
  try {
    // Create a compatible TransferHistory object
    const compatibleTransfer = {
      ...transfer,
      senderEmail: transfer.sender.email,
      receiverEmail: transfer.receiver.email
    }

    const htmlContent = TransferEmailTemplate({ 
      transfer: compatibleTransfer, 
      type 
    })
    
    const toEmail = type === 'sender' 
      ? transfer.sender.email 
      : transfer.receiver.email

    if (!toEmail) {
      throw new Error('Recipient email not found')
    }

    await resend.emails.send({
      from: process.env.NOREPLY_EMAIL || 'noreply@coinspectrum.net',
      to: toEmail,
      subject: `Transfer ${type === 'sender' ? 'Confirmation' : 'Notification'}`,
      html: htmlContent
    })

    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    }
  }
}
