// app/api/admin/signals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tradingSignals } from "@/lib/db/schema";
import { Resend } from "resend";
import { getUserAuth } from "@/lib/auth/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { session } = await getUserAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, price, percentage, expiry, risk, description } = body;

    const signal = await db.insert(tradingSignals).values({
      id: `sig_${Date.now()}`,
      name,
      price,
      percentage,
      expiry,
      risk,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json({ success: true, signal: signal[0] });
  } catch (error) {
    console.error("Failed to create signal:", error);
    return NextResponse.json({ error: "Failed to create signal" }, { status: 500 });
  }
}