// app/_action/transfer-actions.ts
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
    console.log('📧 Email Data:')
    console.log({
      senderEmail,
      recipientEmail,
      amount,
      transferId,
      transferDate,
      resendKey: process.env.RESEND_API_KEY?.slice(0, 6) + '...',
      adminEmail: process.env.ADMIN_EMAIL,
      fromEmail: process.env.RESEND_FROM_EMAIL
    })

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

    console.log('✉️ Email Components:')
    console.log({
      senderComponent: senderEmailComponent,
      recipientComponent: recipientEmailComponent
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

    console.log('📨 Email Send Results:')
    emailResults.forEach((result, index) => {
      console.log(`Email ${index + 1}:`, result.status)
      if (result.status === 'rejected') {
        console.error('Send Error:', result.reason)
      }
    })

    const failedEmails = emailResults.filter(result => result.status === 'rejected')
    if (failedEmails.length > 0) {
      throw new Error(`Failed to send ${failedEmails.length}/3 emails`)
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('🔥 Email Error:')
    console.error({
      message: error.message,
      stack: error.stack,
      rawError: error
    })
    return { 
      success: false,
      error: error.message || "Failed to send email notifications"
    }
  }
}
