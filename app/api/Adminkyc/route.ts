// app/api/admin/kyc/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { KycEmail } from "@/emails/KycEmail";
import { kyc, users } from "@/lib/db/schema";
import { eq, ilike, or, sql } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const limit = 10;
    const offset = (page - 1) * limit;

    const baseQuery = db
      .select({
        kyc,
        user: {
          id: users.id,
          email: users.email,
          fullName: users.fullName,
        },
      })
      .from(kyc)
      .leftJoin(users, eq(kyc.userId, users.id));

    const kycList = await (search
      ? baseQuery.where(
          or(
            ilike(kyc.email, `%${search}%`),
            ilike(users.fullName, `%${search}%`)
          )
        )
      : baseQuery)
      .limit(limit)
      .offset(offset)
      .orderBy(kyc.createdAt);

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(kyc)
      .leftJoin(users, eq(kyc.userId, users.id));

    const totalCount = await (search
      ? countQuery.where(
          or(
            ilike(kyc.email, `%${search}%`),
            ilike(users.fullName, `%${search}%`)
          )
        )
      : countQuery);

    return NextResponse.json({
      kycList,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("KYC fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch KYC list" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kycId, action, rejectionReason } = body;

    const kycRecord = await db
      .select()
      .from(kyc)
      .where(eq(kyc.id, kycId))
      .then(rows => rows[0]);

    if (!kycRecord) {
      return NextResponse.json({ error: "KYC record not found" }, { status: 404 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, kycRecord.userId))
      .then(rows => rows[0]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db
      .update(kyc)
      .set({
        status: action === "approve" ? "approved" : "rejected",
        notes: rejectionReason,
        updatedAt: new Date(),
      })
      .where(eq(kyc.id, kycId));

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: user.email,
      subject: `KYC Verification ${action === "approve" ? "Approved" : "Rejected"}`,
      react: KycEmail({
        userFirstName: user.fullName || "User",
        status: action === "approve" ? "approved" : "rejected",
        rejectionReason,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("KYC process error:", error);
    return NextResponse.json({ error: "Failed to process KYC" }, { status: 500 });
  }
}
