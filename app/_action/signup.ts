'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function signUp(formData: FormData) {
  try {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
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

    // Create user with Clerk
    const clerkUser = await clerkClient.users.createUser({
        firstName,
        lastName,
        username,
        emailAddress: [email], // Pass email as an array
        password,
      });      

    // Store additional user data in your database
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

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Failed to create account' };
  }
}
