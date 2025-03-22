// app/api/transfer/recipient/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUserAuth } from '@/lib/auth/utils'

export async function GET(req: NextRequest) {
  try {
    const { session } = await getUserAuth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: { id: true, firstName: true, lastName: true, username: true }
    })

    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

    return NextResponse.json({ success: true, user }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 })
  }
}
