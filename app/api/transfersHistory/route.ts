// app/api/transfers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { transferHistory } from '@/lib/db/schema'
import { eq, or } from 'drizzle-orm'

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
        sender: { columns: { email: true, firstName: true } },
        receiver: { columns: { email: true, firstName: true } }
      },
      orderBy: (transferHistory, { desc }) => [desc(transferHistory.createdAt)]
    })

    return NextResponse.json({ success: true, transfers }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch transfers" },
      { status: 500 }
    )
  }
}
