import { NextResponse } from "next/server";
import { Resend } from "resend";
import TransactionReceiptEmail from "@/emails/TransactionReceipt";
import { getUserAuth } from "@/lib/auth/utils";
import { currentUser } from "@clerk/nextjs/server";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    const { id, type, amount, date, description, direction, userEmail, userName } = data;

    const email = await resend.emails.send({
      from: "Digital Fortress <noreply@digitalfortress.com>",
      to: userEmail,
      subject: `Your ${type.toLowerCase()} receipt from Digital Fortress`,
      react: TransactionReceiptEmail({
        id,
        type,
        amount,
        date,
        description,
        direction,
        userEmail,
        userName,
      }),
    });

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error("Failed to send receipt email:", error);
    return NextResponse.json(
      { error: "Failed to send receipt email" },
      { status: 500 }
    );
  }
} 