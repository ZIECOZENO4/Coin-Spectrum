// app/api/kyc/status/route.ts
import { db } from "@/db"
import { kyc, users } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ synced: false }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const kycStatus = await db.query.kyc.findFirst({
      where: eq(kyc.userId, userId),
      orderBy: (kyc, { desc }) => [desc(kyc.createdAt)],
      columns: {
        status: true,
        notes: true,
        createdAt: true
      }
    })

    if (!kycStatus) {
      return NextResponse.json({ status: null })
    }

    return NextResponse.json({
      status: kycStatus.status,
      notes: kycStatus.notes,
      submissionDate: kycStatus.createdAt.toISOString()
    })

  } catch (error) {
    console.error('Error fetching KYC status:', error)
    return NextResponse.json(
      { error: "Failed to fetch KYC status" },
      { status: 500 }
    )
  }
}
