import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(firstName: string, email: string) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Welcome to Coin Spectrum!',
      html: `
        <h1>Welcome to Coin Spectrum, ${firstName}!</h1>
        <p>We're excited to have you on board.</p>
      `
    });
    console.log('Welcome email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

async function sendSignInAlert(data: {
  firstName: string;
  email: string;
  signInTime: string;
  deviceInfo: string;
  location: string;
}) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: data.email,
      subject: 'New Sign-in Detected',
      html: `
        <h1>New Sign-in Alert</h1>
        <p>Hi ${data.firstName},</p>
        <p>We detected a new sign-in to your account:</p>
        <ul>
          <li>Time: ${data.signInTime}</li>
          <li>Device: ${data.deviceInfo}</li>
          <li>Location: ${data.location}</li>
        </ul>
      `
    });
    console.log('Sign-in alert sent successfully to:', data.email);
  } catch (error) {
    console.error('Error sending sign-in alert:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  console.log('Webhook received');
  
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers');
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }

  // Handle user creation (sign up)
  if (evt.type === 'user.created') {
    console.log('Processing user.created event');
    const { first_name, email_addresses } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    if (primaryEmail) {
      try {
        await sendWelcomeEmail(first_name || 'User', primaryEmail);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        return new Response('Failed to send welcome email', { status: 500 });
      }
    }
  }

  // Handle session creation (sign in)
  if (evt.type === 'session.created') {
    console.log('Processing session.created event');
    const { user_id } = evt.data;
    
    try {
      // Fetch user details
      const userResponse = await fetch(`https://api.clerk.dev/v1/users/${user_id}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });
      const user = await userResponse.json();

      // Fetch session details
      const sessionsResponse = await fetch(`https://api.clerk.dev/v1/users/${user_id}/sessions`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });
      const sessions = await sessionsResponse.json();

      const latestSession = sessions[0];
      
      if (latestSession && user) {
        const deviceInfo = `${latestSession?.last_active_device?.browser_name || 'Unknown browser'} on ${latestSession?.last_active_device?.os_name || 'Unknown OS'}`;
        const location = `${latestSession?.last_active_device?.city || 'Unknown city'}, ${latestSession?.last_active_device?.country || 'Unknown country'}`;
        
        await sendSignInAlert({
          firstName: user.first_name || 'User',
          email: user.email_addresses[0].email_address,
          signInTime: new Date().toLocaleString(),
          deviceInfo,
          location,
        });
      }
    } catch (error) {
      console.error('Failed to send sign-in alert:', error);
      return new Response('Failed to send sign-in alert', { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Webhook processed successfully' });
}
