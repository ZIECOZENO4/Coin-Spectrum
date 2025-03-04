import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { userReferrals, users } from "@/lib/db/schema"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const referrals = await db
      .select({
        id: userReferrals.id,
        email: users.email,
        fullName: users.fullName,
        createdAt: userReferrals.createdAt,
      })
      .from(userReferrals)
      .innerJoin(users, eq(userReferrals.referredUserId, users.id))
      .where(eq(userReferrals.referrerId, userId))

    return NextResponse.json(referrals)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch referrals" },
      { status: 500 }
    )
  }
}
