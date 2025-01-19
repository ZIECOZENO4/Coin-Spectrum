import { Resend } from 'resend';
import { SignInEmail } from '@/emails/SignInEmail';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, email, signInTime, deviceInfo, location } = await request.json();

    const data = await resend.emails.send({
        from: 'support@www.coinspectrum.net',
      to: email,
      subject: 'WELCOME BACK TO COIN SPECTRUM',
      react: SignInEmail({ 
        userFirstName: firstName,
        userEmail: email,
        signInTime,
        deviceInfo,
        location
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
