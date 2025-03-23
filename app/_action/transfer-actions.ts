'use server'

import { Resend } from 'resend'
import React from 'react'
import { TransferSent } from '@/emails/transfer-sent'
import { TransferReceived } from '@/emails/transfer-received'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTransferEmails(
  senderEmail: string,
  recipientEmail: string,
  amount: number,
  transferId: string,
  transferDate: string
) {
  try {
    // Create React elements without JSX
    const senderEmailComponent = React.createElement(TransferSent, {
      recipientName: recipientEmail,
      senderName: senderEmail,
      amount,
      transferId,
      transferDate
    })

    const recipientEmailComponent = React.createElement(TransferReceived, {
      recipientName: recipientEmail,
      senderName: senderEmail,
      amount,
      transferId,
      transferDate
    })

    // Send emails using Resend's react option
    const emailResults = await Promise.allSettled([
      resend.emails.send({
        from: process.env.ADMIN_EMAIL || 'notifications@coinspectrum.net',
        to: senderEmail,
        subject: 'Transfer Successful',
        react: senderEmailComponent
      }),
      resend.emails.send({
        from: process.env.ADMIN_EMAIL || 'notifications@coinspectrum.net',
        to: recipientEmail,
        subject: 'Funds Received',
        react: recipientEmailComponent
      }),
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@coinspectrum.net',
        to: process.env.ADMIN_EMAIL || 'admin@coinspectrum.net',
        subject: `New Transfer - ${transferId}`,
        text: `New transfer of $${amount} between ${senderEmail} and ${recipientEmail}`
      })
    ])

    const failedEmails = emailResults.filter(result => result.status === 'rejected')
    if (failedEmails.length > 0) {
      throw new Error(`Failed to send ${failedEmails.length}/3 emails`)
    }

    return { success: true, error: null }
  } catch (error: any) {
    return { 
      success: false,
      error: error.message || "Failed to send email notifications"
    }
  }
}
