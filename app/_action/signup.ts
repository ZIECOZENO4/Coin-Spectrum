'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { clerkClient } from "@clerk/clerk-sdk-node";
import { Resend } from 'resend';
import { WelcomeEmail } from "@/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function signUp(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;

    // Check if email or username already exists
    const existingUser = await clerkClient.users.getUserList({
      emailAddress: [email],
    });
    
    if (existingUser.data.length > 0) {
      return { success: false, error: 'Email address is already in use.' };
    }
    
    const existingUsername = await clerkClient.users.getUserList({
      username: [username],
    });
    
    if (existingUsername.data.length > 0) {
      return { success: false, error: 'Username is already taken.' };
    }

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const password = formData.get('password') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const bitcoinAccountId = formData.get('bitcoinAccountId') as string;
    const usdtTrc20AccountId = formData.get('usdtTrc20AccountId') as string;
    const ethereumAccountId = formData.get('ethereumAccountId') as string;
    const litecoinAccountId = formData.get('litecoinAccountId') as string;
    const dogecoinAccountId = formData.get('dogecoinAccountId') as string;
    const xrpAccountId = formData.get('xrpAccountId') as string;
    const usdtErc20AccountId = formData.get('usdtErc20AccountId') as string;
    const country = formData.get('country') as string;

    const clerkUser = await clerkClient.users.createUser({
      firstName,
      lastName,
      username,
      emailAddress: [email],
      password,
    });

    // Create user in database
    await db.insert(users).values({
      id: clerkUser.id,
      firstName,
      lastName,
      username,
      fullName: `${firstName} ${lastName}`,
      email,
      phoneNumber,
      bitcoinAccountId,
      usdtTrc20AccountId,
      ethereumAccountId,
      litecoinAccountId,
      dogecoinAccountId,
      xrpAccountId,
      usdtErc20AccountId,
      country,
    });

    // Send welcome email to user
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Welcome to Coin Spectrum!',
      react: WelcomeEmail({
        userFirstName: firstName || username,
        userEmail: email
      })
    });

    // Send notification to admin
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: 'New User Registration on Coin Spectrum',
      html: `
        <h1>New User Registration</h1>
        <p>A new user has registered:</p>
        <ul>
          <li>Name: ${firstName} ${lastName}</li>
          <li>Username: ${username}</li>
          <li>Email: ${email}</li>
          <li>Country: ${country}</li>
          <li>Phone: ${phoneNumber}</li>
          <li>Registration Time: ${new Date().toLocaleString()}</li>
        </ul>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Failed to create account. Please try again.' };
  }
}
