import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

interface CustomSessionClaims {
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  location: {
    city: string;
    country: string;
  };
}

export async function POST(req: Request) {
  const evt = await req.json() as WebhookEvent;

  // Handle user creation (sign up)
  if (evt.type === 'user.created') {
    const { first_name, email_addresses } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    if (primaryEmail) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: first_name,
          email: primaryEmail,
        }),
      });
    }
  }

  // Handle session creation (sign in)
  if (evt.type === 'session.created') {
    const { user_id } = evt.data;
    
    // Fetch user details including session information
    const user = await fetch(`https://api.clerk.dev/v1/users/${user_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());

    // Get session information from the latest session
    const sessions = await fetch(`https://api.clerk.dev/v1/users/${user_id}/sessions`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());

    const latestSession = sessions[0];
    
    const deviceInfo = `${latestSession?.last_active_device?.browser_name || 'Unknown browser'} on ${latestSession?.last_active_device?.os_name || 'Unknown OS'}`;
    const location = `${latestSession?.last_active_device?.city || 'Unknown city'}, ${latestSession?.last_active_device?.country || 'Unknown country'}`;
    const signInTime = new Date().toLocaleString();

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-signin-alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: user.first_name,
        email: user.email_addresses[0].email_address,
        signInTime,
        deviceInfo,
        location,
      }),
    });
  }

  return NextResponse.json({ message: 'Webhook processed' });
}
