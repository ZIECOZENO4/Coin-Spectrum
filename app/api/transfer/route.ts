
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, transferHistory } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { getUserAuth } from '@/lib/auth/utils'
import { v4 as uuidv4 } from 'uuid'
import { sendTransferEmails } from '@/app/_action/transfer-actions'

export async function POST(req: NextRequest) {
  try {
    const { session } = await getUserAuth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipientEmail, amount, pin } = await req.json()
    
    // Validation remains the same
    if (!recipientEmail || !amount || !pin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      return NextResponse.json({ error: "Invalid PIN format" }, { status: 400 })
    }

    // Database queries remain the same
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

    // Validation checks remain the same
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

    // Transaction handling
    const transferId = uuidv4()
    const transferDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
    
    try {
      await db.transaction(async (tx) => {
        await tx.update(users)
          .set({ balance: sql`${users.balance} - ${amount}` })
          .where(eq(users.id, sender.id))

        await tx.update(users)
          .set({ balance: sql`${users.balance} + ${amount}` })
          .where(eq(users.id, recipient.id))

        await tx.insert(transferHistory).values({
          id: transferId,
          senderId: sender.id,
          receiverId: recipient.id,
          amount,
          status: 'completed',
          createdAt: sql`now()`,
          updatedAt: sql`now()`
        })
      })
    } catch (error: any) {
      console.error("Transaction error:", error)
      return NextResponse.json(
        { error: "Transfer failed: Database transaction error" },
        { status: 500 }
      )
    }

    // Use server action for email notifications
    const emailResult = await sendTransferEmails(
      sender.email!,
      recipient.email!,
      amount,
      transferId,
      transferDate
    )

    if (!emailResult.success) {
      console.error("Email delivery failed:", emailResult.error)
      return NextResponse.json(
        { error: "Transfer completed but email notifications failed" },
        { status: 200 }
      )
    }

    return NextResponse.json({ 
      success: true,
      transferId,
      newBalance: sender.balance - amount
    }, { status: 200 })

  } catch (error: any) {
    console.error("Transfer error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Internal server error",
        detailedError: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
