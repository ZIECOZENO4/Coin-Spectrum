import { TransferHistory } from "@/types/TransferHistory"

// components/email-template.tsx
export function TransferEmailTemplate({
    transfer,
    type,
  }: {
    transfer: TransferHistory
    type: 'sender' | 'receiver'
  }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .email-container { max-width: 600px; margin: 0 auto; font-family: 'Inter', sans-serif; }
          .header { background: #1a365d; padding: 2rem; color: white; border-radius: 8px 8px 0 0; }
          .content { padding: 2rem; background: #f8fafc; border-radius: 0 0 8px 8px; }
          .amount { font-size: 2.5rem; font-weight: bold; color: #1a365d; margin: 1rem 0; }
          .details { background: white; padding: 1.5rem; border-radius: 8px; }
          .detail-item { display: flex; justify-content: space-between; margin: 0.5rem 0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>💰 Transfer ${type === 'sender' ? 'Sent' : 'Received'}</h1>
          </div>
          <div class="content">
            <div class="amount">$${transfer.amount.toFixed(2)}</div>
            <div class="details">
              <div class="detail-item">
                <span>${type === 'sender' ? 'Receiver' : 'Sender'}:</span>
                <span>${type === 'sender' ? transfer.receiverEmail : transfer.senderEmail}</span>
              </div>
              <div class="detail-item">
                <span>Date:</span>
                <span>${new Date(transfer.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="detail-item">
                <span>Status:</span>
                <span style="color: ${transfer.status === 'completed' ? '#10b981' : '#f59e0b'}">
                  ${transfer.status}
                </span>
              </div>
            </div>
            <p style="margin-top: 2rem; color: #64748b;">
              This is an automated notification regarding your recent transfer.
              Please contact support if you have any questions.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }
  