import { ReferralOwnerEmail } from "@/emails/ReferralOwnerEmail";
import { ReferredUserEmail } from "@/emails/ReferredUserEmail";

import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { users, userReferrals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';
import { toast } from "sonner";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest): Promise<NextResponse> {
    const { session } = await getUserAuth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { referralId } = await request.json();
  
    try {
      if (referralId === session.user.id) {
        return NextResponse.json({ error: "Self referral not allowed" }, { status: 400 });
      }

      const referrer = await db.query.users.findFirst({
        where: eq(users.id, referralId),
      });
  
      if (!referrer) {
        return NextResponse.json({ error: "Invalid referral" }, { status: 404 });
      }

      const referredUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
      });
  
      if (!referredUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      // Check if user already has a referral
      const existingReferral = await db.query.userReferrals.findFirst({
        where: eq(userReferrals.referredUserId, session.user.id),
      });
  
      if (existingReferral) {
        return NextResponse.json({ error: "Referral already exists" }, { status: 400 });
      }
  
      // Create referral record
      const newReferral = await db.insert(userReferrals).values({
        id: crypto.randomUUID(),
        referrerId: referralId,
        referredUserId: session.user.id,
      }).returning();
  
      // Send emails
      await Promise.all([
        resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: referrer.email!,
          subject: 'New Referral Registration!',
          react: ReferralOwnerEmail({
            ownerName: referrer.firstName || referrer.username || 'User',
            referredUserEmail: referredUser.email!,
            date: new Date().toISOString()
          })
        }),
        
        resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: referredUser.email!,
          subject: 'Welcome to Coin Spectrum!',
          react: ReferredUserEmail({
            userName: referredUser.firstName || referredUser.username || 'User',
            referrerName: referrer.firstName || referrer.username || 'User',
            date: new Date().toISOString()
          })
        })
      ]);
  
      return NextResponse.json(newReferral[0], { status: 200 });
  
    } catch (error) {
      console.error(error);
      return NextResponse.json({ 
        error: "Failed to process referral" 
      }, { status: 500 });
    }
  }
  