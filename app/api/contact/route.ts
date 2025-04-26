import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const companyEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_CONTACT_EMAIL;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Coin Spectrum <noreply@coinspectrum.net>';

if (!companyEmail) {
  throw new Error('Company email is not set in environment variables.');
}

export async function POST(req: Request) {
  try {
    const { name, email, tel } = await req.json();
    if (!name || !email || !tel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Send email to company
    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: [companyEmail],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telephone:</strong> ${tel}</p>
      `,
      reply_to: email,
    });
    if (sendError) {
      return NextResponse.json({ error: sendError }, { status: 500 });
    }

    // Send auto-reply to user
    const { error: replyError } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'We received your message!',
      html: `
        <h2>Thank you for contacting Coin Spectrum!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br/>Coin Spectrum Team</p>
      `,
    });
    if (replyError) {
      return NextResponse.json({ error: replyError }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 