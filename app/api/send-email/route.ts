// app/api/send-email/route.ts
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, content } = await req.json();

    const data = await resend.emails.send({
      from: "Coin Spectrum <noreply@coinspectrum.net>",
      to: [to],
      subject: subject,
      html: content,
    });

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
