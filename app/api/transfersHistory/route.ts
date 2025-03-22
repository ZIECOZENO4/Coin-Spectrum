// app/api/transfers/route.ts (improved query)
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { transferHistory, users } from '@/lib/db/schema'
import { eq, or, and } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const transfers = await db.query.transferHistory.findMany({
      where: or(
        eq(transferHistory.senderId, userId),
        eq(transferHistory.receiverId, userId)
      ),
      with: {
        sender: {
          columns: { email: true, firstName: true },
          where: and(eq(users.id, transferHistory.senderId))
        },
        receiver: {
          columns: { email: true, firstName: true },
          where: and(eq(users.id, transferHistory.receiverId))
        }
      },
      orderBy: (transferHistory, { desc }) => [desc(transferHistory.createdAt)],
      limit: 50 // Add pagination for better performance
    })

    // Convert decimal amounts to numbers
    const formattedTransfers = transfers.map(transfer => ({
      ...transfer,
      amount: Number(transfer.amount)
    }))

    return NextResponse.json({ 
      success: true, 
      transfers: formattedTransfers 
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch transfers" },
      { status: 500 }
    )
  }
}
