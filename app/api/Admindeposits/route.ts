// app/api/admin/deposits/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { 
  pendingDeposits, 
  users,
  transactionHistory,
  TransactionTypeEnum 
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { DepositEmail } from "@/emails/ConfirmDeposit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

    const deposits = await db
      .select({
        deposit: pendingDeposits,
        user: {
          id: users.id,
        }
      })
      .from(pendingDeposits)
      .leftJoin(users, eq(pendingDeposits.userId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${pendingDeposits.createdAt} desc`);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(pendingDeposits);

    return NextResponse.json({
      deposits,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch deposits" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { depositId, usdValue, action } = body;

    const deposit = await db
      .select()
      .from(pendingDeposits)
      .where(eq(pendingDeposits.id, depositId))
      .then(rows => rows[0]);

    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, deposit.userId))
      .then(rows => rows[0]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "approve") {
      await db.transaction(async (tx) => {
        // Update user balance
        await tx
          .update(users)
          .set({
            balance: sql`balance + ${usdValue}`,
          })
          .where(eq(users.id, deposit.userId));

        // Create transaction history
        await tx.insert(transactionHistory).values({
          id: `th_${deposit.id}`,
          userId: deposit.userId,
          type: TransactionTypeEnum.Deposit,
          amount: usdValue,
          description: `Deposit of ${deposit.amount} ${deposit.cryptoType} approved`,
        });

        // Delete pending deposit
        await tx
          .delete(pendingDeposits)
          .where(eq(pendingDeposits.id, depositId));
      });

      // Send approval email
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: "Deposit Approved",
        react: DepositEmail({
          userFirstName: user.fullName || "User",
          amount: deposit.amount.toString(),
          type: deposit.cryptoType,
          status: "approved",
          transactionDate: new Date().toISOString(),
          depositId: deposit.id,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process deposit" }, { status: 500 });
  }
}
