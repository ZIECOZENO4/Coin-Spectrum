import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const { firstName, email } = await request.json();

    const data = await resend.emails.send({
      from: 'support@www.coinspectrum.net',
      to: email,
      subject: 'WELCOME TO COIN SPECTRUM LTD!',
      react: WelcomeEmail({ 
        userFirstName: firstName,
        userEmail: email 
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
