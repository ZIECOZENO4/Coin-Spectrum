// 'use server'

// import { db } from '@/lib/db';
// import { users } from '@/lib/db/schema';
// import { clerkClient } from "@clerk/clerk-sdk-node";
// import { Resend } from 'resend';
// import { WelcomeEmail } from "@/emails/WelcomeEmail";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function signUp(formData: FormData) {
//   try {
//     const email = formData.get('email') as string;
//     const username = formData.get('username') as string;

//     // Check if email or username already exists
//     const existingUser = await clerkClient.users.getUserList({
//       emailAddress: [email],
//     });
    
//     if (existingUser.data.length > 0) {
//       return { success: false, error: 'Email address is already in use.' };
//     }
    
//     const existingUsername = await clerkClient.users.getUserList({
//       username: [username],
//     });
    
//     if (existingUsername.data.length > 0) {
//       return { success: false, error: 'Username is already taken.' };
//     }

//     const firstName = formData.get('firstName') as string;
//     const lastName = formData.get('lastName') as string;
//     const password = formData.get('password') as string;
//     const phoneNumber = formData.get('phoneNumber') as string;
//     const bitcoinAccountId = formData.get('bitcoinAccountId') as string;
//     const usdtTrc20AccountId = formData.get('usdtTrc20AccountId') as string;
//     const ethereumAccountId = formData.get('ethereumAccountId') as string;
//     const litecoinAccountId = formData.get('litecoinAccountId') as string;
//     const dogecoinAccountId = formData.get('dogecoinAccountId') as string;
//     const xrpAccountId = formData.get('xrpAccountId') as string;
//     const usdtErc20AccountId = formData.get('usdtErc20AccountId') as string;
//     const country = formData.get('country') as string;

//     const clerkUser = await clerkClient.users.createUser({
//       firstName,
//       lastName,
//       username,
//       emailAddress: [email],
//       password,
//     });

//     // Create user in database
//     await db.insert(users).values({
//       id: clerkUser.id,
//       firstName,
//       lastName,
//       username,
//       fullName: `${firstName} ${lastName}`,
//       email,
//       phoneNumber,
//       bitcoinAccountId,
//       usdtTrc20AccountId,
//       ethereumAccountId,
//       litecoinAccountId,
//       dogecoinAccountId,
//       xrpAccountId,
//       usdtErc20AccountId,
//       country,
//     });

//     // Send welcome email to user
//     await resend.emails.send({
//       from: process.env.RESEND_FROM_EMAIL!,
//       to: email,
//       subject: 'Welcome to Coin Spectrum!',
//       react: WelcomeEmail({
//         userFirstName: firstName || username,
//         userEmail: email
//       })
//     });

//     // Send notification to admin
//     await resend.emails.send({
//       from: process.env.RESEND_FROM_EMAIL!,
//       to: process.env.ADMIN_EMAIL!,
//       subject: 'New User Registration on Coin Spectrum',
//       html: `
//         <h1>New User Registration</h1>
//         <p>A new user has registered:</p>
//         <ul>
//           <li>Name: ${firstName} ${lastName}</li>
//           <li>Username: ${username}</li>
//           <li>Email: ${email}</li>
//           <li>Country: ${country}</li>
//           <li>Phone: ${phoneNumber}</li>
//           <li>Registration Time: ${new Date().toLocaleString()}</li>
//         </ul>
//       `
//     });

//     return { success: true };
//   } catch (error) {
//     console.error('Signup error:', error);
//     return { success: false, error: 'Failed to create account. Please try again.' };
//   }
// }


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
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    // Check existing users
    const [existingByEmail, existingByUsername] = await Promise.all([
      clerkClient.users.getUserList({ emailAddress: [email] }),
      clerkClient.users.getUserList({ username: [username] })
    ]);

    if (existingByEmail.data.length > 0) {
      return { success: false, error: 'Email address is already in use.' };
    }
    
    if (existingByUsername.data.length > 0) {
      return { success: false, error: 'Username is already taken.' };
    }

    // Parse form data
    const userData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      username,
      email,
      password,
      phoneNumber: formData.get('phoneNumber') as string,
      country: formData.get('country') as string,
      currency: formData.get('currency') as string,
      tradingAccountType: formData.get('tradingAccountType') as string,
      cryptoAccounts: JSON.parse(formData.get('cryptoAccounts') as string) || {}
    };

    // Create Clerk user
    const clerkUser = await clerkClient.users.createUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      emailAddress: [userData.email],
      password: userData.password,
    });

    // Create database user
    await db.insert(users).values({
      id: clerkUser.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      fullName: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      country: userData.country,
      currency: userData.currency,
      tradingAccountType: userData.tradingAccountType,
      cryptoAccounts: userData.cryptoAccounts,
    });

    // Send welcome email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: userData.email,
      subject: 'Welcome to Coin Spectrum!',
      react: WelcomeEmail({
        userFirstName: userData.firstName || userData.username,
        userEmail: userData.email
      })
    });

    // Admin notification
    const cryptoAccountsList = Object.entries(userData.cryptoAccounts)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: 'New User Registration',
      text: `
        New user registration details:
        Name: ${userData.firstName} ${userData.lastName}
        Username: ${userData.username}
        Email: ${userData.email}
        Country: ${userData.country}
        Currency: ${userData.currency}
        Trading Account: ${userData.tradingAccountType}
        Phone: ${userData.phoneNumber}
        Crypto Accounts:\n${cryptoAccountsList}
        Registered: ${new Date().toLocaleString()}
      `
    });

    return { success: true };
  } catch (error: any) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.message?.includes('JSON') 
        ? 'Invalid crypto account data'
        : 'Failed to create account. Please try again.'
    };
  }
}
