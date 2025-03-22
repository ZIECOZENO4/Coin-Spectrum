// app/api/admin/transaction-pins/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { auth } from '@clerk/nextjs/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allUsers = await db.query.users.findMany({
      columns: { id: true, email: true, transactionPin: true }
    })

    return NextResponse.json({ success: true, users: allUsers }, { status: 200 })
  } catch (error: any) {
    console.error("Admin users fetch error:", error)
    return NextResponse.json({ error: error.message || "Fetch failed" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  try {

    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pin } = await req.json()
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be 4 digits" }, { status: 400 })
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, params.userId),
      columns: { email: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await db.update(users)
      .set({ transactionPin: pin })
      .where(eq(users.id, params.userId))

    // Send confirmation email
    await resend.emails.send({
      from: process.env.NOREPLY_EMAIL || 'noreply@coinspectrum.net',
      to: user.email,
      subject: 'Transaction PIN Updated',
      text: `Your transaction PIN has been updated to: ${pin}`,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Admin PIN update error:", error)
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 })
  }
}
