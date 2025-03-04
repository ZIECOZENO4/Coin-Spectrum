
// app/api/referrals/
import { NextResponse } from "next/server"
import { Resend } from "resend"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { users } from "@/lib/db/schema"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { to } = await req.json()
    
    const [referrer] = await db
      .select({
        fullName: users.fullName,
        email: users.email
      })
      .from(users)
      .where(eq(users.id, userId))

    if (!referrer) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { data, error } = await resend.emails.send({
      from: "Coin Spectrum <noreply@coinspectrum.net>",
      to: [to],
      subject: "Thank You for Joining Coin Spectrum!",
      html: `
        <div class="bg-gray-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-yellow-500 mb-4">Welcome to Our Community!</h2>
          <p class="text-gray-700 mb-4">Dear User,</p>
          <p class="text-gray-700 mb-4">
            Thank you for joining Coin Spectrum through ${referrer.fullName}'s referral. 
            We're excited to have you as part of our growing community!
          </p>
          <p class="text-gray-700 mb-6">
            If you need any help getting started, feel free to reach out to our support team.
          </p>
          <div class="border-t pt-4">
            <p class="text-sm text-gray-600">
              Best regards,<br/>
              Coin Spectrum Team
            </p>
          </div>
        </div>
      `
    })

    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
