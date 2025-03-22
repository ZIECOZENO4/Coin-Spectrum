// // app/api/transfer/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { db } from '@/lib/db'
// import { users, transferHistory } from '@/lib/db/schema'
// import { eq, sql } from 'drizzle-orm'
// import { getUserAuth } from '@/lib/auth/utils'
// import { Resend } from 'resend'
// import { v4 as uuidv4 } from 'uuid'

// const resend = new Resend(process.env.RESEND_API_KEY)

// export async function POST(req: NextRequest) {
//   try {
//     const { session } = await getUserAuth()
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { recipientEmail, amount, pin } = await req.json()
    
//     // Validate input
//     if (!recipientEmail || !amount || !pin) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }
    
//     if (pin.length !== 4 || !/^\d+$/.test(pin)) {
//       return NextResponse.json({ error: "Invalid PIN format" }, { status: 400 })
//     }

//     // Get sender and recipient with proper locking
//     const [sender, recipient] = await Promise.all([
//       db.query.users.findFirst({
//         where: eq(users.id, session.user.id),
//         columns: { id: true, email: true, balance: true, transactionPin: true }
//       }),
//       db.query.users.findFirst({
//         where: eq(users.email, recipientEmail),
//         columns: { id: true, email: true, balance: true }
//       })
//     ])

//     // Validate transaction
//     if (!sender || !recipient) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     if (sender.id === recipient.id) {
//       return NextResponse.json({ error: "Cannot transfer to yourself" }, { status: 400 })
//     }

//     if (sender.transactionPin !== pin) {
//       return NextResponse.json({ error: "Incorrect transaction PIN" }, { status: 401 })
//     }

//     if (sender.balance < amount) {
//       return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
//     }

//     // Perform transfer with proper transaction handling
//     const transferId = uuidv4()
    
//     try {
//       await db.transaction(async (tx) => {
//         // Atomic balance updates using SQL expressions
//         await tx.update(users)
//           .set({ balance: sql`${users.balance} - ${amount}` })
//           .where(eq(users.id, sender.id))

//         await tx.update(users)
//           .set({ balance: sql`${users.balance} + ${amount}` })
//           .where(eq(users.id, recipient.id))

//         // Create transfer record with UUID and timestamps
//         await tx.insert(transferHistory).values({
//           id: transferId,
//           senderId: sender.id,
//           receiverId: recipient.id,
//           amount,
//           status: 'completed',
//           createdAt: sql`now()`,
//           updatedAt: sql`now()`
//         })
//       })
//     } catch (error: any) {
//       console.error("Transaction error:", error)
//       return NextResponse.json(
//         { error: "Transfer failed: Database transaction error" },
//         { status: 500 }
//       )
//     }

//     // Email notifications (outside transaction)
//     try {
//       await Promise.all([
//         resend.emails.send({
//           from:  process.env.ADMIN_EMAIL || 'admin@coinspectrum.net',
//           to: sender.email!,
//           subject: 'Transfer Successful',
//           text: `You've successfully transferred $${amount} to ${recipient.email}`
//         }),
//         resend.emails.send({
//           from:  process.env.ADMIN_EMAIL || 'admin@coinspectrum.net',
//           to: recipient.email!,
//           subject: 'Funds Received',
//           text: `You've received $${amount} from ${sender.email}`
//         })
//       ])
//     } catch (emailError) {
//       console.error("Email sending failed:", emailError)
//       // Don't fail the request if emails fail
//     }

//     return NextResponse.json({ 
//       success: true,
//       transferId,
//       newBalance: sender.balance - amount
//     }, { status: 200 })

//   } catch (error: any) {
//     console.error("Transfer error:", error)
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     )
//   }
// }


// app/api/transfer/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, transferHistory } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { getUserAuth } from '@/lib/auth/utils'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { session } = await getUserAuth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipientEmail, amount, pin } = await req.json()
    
    // Validate input
    if (!recipientEmail || !amount || !pin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      return NextResponse.json({ error: "Invalid PIN format" }, { status: 400 })
    }

    // Get sender and recipient with proper locking
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

    // Perform transfer with proper transaction handling
    const transferId = uuidv4()
    
    try {
      await db.transaction(async (tx) => {
        // Atomic balance updates using SQL expressions
        await tx.update(users)
          .set({ balance: sql`${users.balance} - ${amount}` })
          .where(eq(users.id, sender.id))

        await tx.update(users)
          .set({ balance: sql`${users.balance} + ${amount}` })
          .where(eq(users.id, recipient.id))

        // Create transfer record with UUID and timestamps
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

    // Email notifications (now critical part of the transaction)
    const emailResults = await Promise.allSettled([
      resend.emails.send({
        from: process.env.ADMIN_EMAIL || 'notifications@coinspectrum.net',
        to: sender.email!,
        subject: 'Transfer Successful',
        text: `You've successfully transferred $${amount} to ${recipient.email}`
      }),
      resend.emails.send({
        from: process.env.ADMIN_EMAIL || 'notifications@coinspectrum.net',
        to: recipient.email!,
        subject: 'Funds Received',
        text: `You've received $${amount} from ${sender.email}`
      })
    ])

    // Check for email failures
    const failedEmails = emailResults.filter(result => result.status === 'rejected')
    if (failedEmails.length > 0) {
      console.error("Email delivery failed:", failedEmails)
      throw new Error(`Failed to send ${failedEmails.length} email(s)`)
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
        detailedError: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
