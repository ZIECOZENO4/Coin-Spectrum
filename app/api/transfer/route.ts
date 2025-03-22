// app/api/transfer/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, transferHistory } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUserAuth } from '@/lib/auth/utils'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { session } = await getUserAuth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { recipientEmail, amount, pin } = await req.json()
    
    // Validate input
    if (!recipientEmail || !amount || !pin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      return NextResponse.json({ error: "Invalid PIN format" }, { status: 400 })
    }

    // Get sender and recipient
    const [sender, recipient] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { id: true, email: true, balance: true, transactionPin: true }
      }),
      db.query.users.findFirst({
        where: eq(users.email, recipientEmail),
        columns: { id: true, email: true, balance: true }
      })
    ])

    // Validate transaction
    if (!sender || !recipient) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (sender.id === recipient.id) {
      return NextResponse.json({ error: "Cannot transfer to yourself" }, { status: 400 })
    }

    if (sender.transactionPin !== pin) {
      return NextResponse.json({ error: "Incorrect transaction PIN" }, { status: 401 })
    }

    if (sender.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Perform transfer
    await db.transaction(async (tx) => {
      // Update balances
      await tx.update(users)
        .set({ balance: sender.balance - amount })
        .where(eq(users.id, sender.id))

      await tx.update(users)
        .set({ balance: recipient.balance + amount })
        .where(eq(users.id, recipient.id))

      // Create transfer record
      await tx.insert(transferHistory).values({
        senderId: sender.id,
        receiverId: recipient.id,
        amount,
        status: 'completed'
      })
    })

    // Send emails
    await Promise.all([
      resend.emails.send({
        from: process.env.NOREPLY_EMAIL!,
        to: sender.email!,
        subject: 'Transfer Successful',
        text: `You've successfully transferred $${amount} to ${recipient.email}`
      }),
      resend.emails.send({
        from: process.env.NOREPLY_EMAIL!,
        to: recipient.email!,
        subject: 'Funds Received',
        text: `You've received $${amount} from ${sender.email}`
      })
    ])

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Transfer error:", error)
    return NextResponse.json({ error: error.message || "Transfer failed" }, { status: 500 })
  }
}
