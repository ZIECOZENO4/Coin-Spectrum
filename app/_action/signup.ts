'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { clerkClient } from "@clerk/clerk-sdk-node";

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
    

    // If email and username are unique, proceed with user creation
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
    return { success: false, error: 'Failed to create account. Please try again.' };
  }
}
