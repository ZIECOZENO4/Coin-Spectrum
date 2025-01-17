import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signalPurchases, tradingSignals, users } from "@/lib/db/schema";
import { Resend } from "resend";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { SignalEmail } from "@/emails/SignalEmail";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
      const { session } = await getUserAuth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { signalId } = await req.json();
  
      const [user, signal] = await Promise.all([
        db.query.users.findFirst({
          where: eq(users.id, session.user.id)
        }),
        db.query.tradingSignals.findFirst({
          where: eq(tradingSignals.id, signalId)
        })
      ]);
  
      if (!user || !signal) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }
  
      if (user.balance < signal.price) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }
  
      const purchase = await db.transaction(async (tx) => {
        // Create purchase record
        const [newPurchase] = await tx.insert(signalPurchases).values({
          id: `sp_${Date.now()}`,
          userId: user.id,
          signalId: signal.id,
          amount: signal.price,
          status: "active",
          purchasedAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }).returning();
  
        // Update user balance
        await tx.update(users)
          .set({ balance: user.balance - signal.price })
          .where(eq(users.id, user.id));
  
        return newPurchase;
      });
  
      // Send email notification
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: "Trading Signal Purchase Confirmation",
        react: SignalEmail({
          userName: user.firstName || user.email,
          signalName: signal.name,
          price: signal.price,
          percentage: signal.percentage,
          expiry: signal.expiry,
          risk: signal.risk,
          description: signal.description,
        })
      });
  
      return NextResponse.json({ success: true, purchase });
    } catch (error) {
      console.error("Failed to purchase signal:", error);
      return NextResponse.json({ error: "Failed to purchase signal" }, { status: 500 });
    }
  }
  