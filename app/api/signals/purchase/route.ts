// app/api/signals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tradingSignals, users } from "@/lib/db/schema";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { SignalEmail } from "@/emails/PurchaseSignal";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const allSignals = await db
      .select()
      .from(tradingSignals)
      .where(eq(tradingSignals.isActive, true))
      .orderBy(tradingSignals.createdAt);

    return NextResponse.json({ signals: allSignals });
  } catch (error) {
    console.error("Failed to fetch signals:", error);
    return NextResponse.json(
      { error: "Failed to fetch signals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    
    const { signalId } = await req.json();
    const { session } = await getUserAuth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [user, signal] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, session.user.id)
      }),
      db.query.tradingSignals.findFirst({
        where: eq(tradingSignals.id, signalId)
      })
    ]);

    if (!user || !signal) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    if (user.balance < signal.price) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    const purchase = await db.transaction(async (tx) => {
      // Update user balance
      await tx.update(users)
        .set({ 
          balance: user.balance - signal.price,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      // Send email notification
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: `Trading Signal: ${signal.name}`,
        react: SignalEmail({
          userName: user.firstName || user.email,
          signalName: signal.name,
          price: signal.price,
          percentage: signal.percentage,
          expiry: signal.expiry,
          risk: signal.risk,
          description: signal.description
        })
      });

      return { success: true };
    });

    return NextResponse.json(purchase);

  } catch (error) {
    console.error("Signal purchase failed:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
