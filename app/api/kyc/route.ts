// app/api/kyc/route.ts
import { db } from "@/db";
import { kyc, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { KYCEmail } from "@/emails/kyc-email";
import { eq } from 'drizzle-orm';
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

const resend = new Resend(process.env.RESEND_API_KEY);

const KYCFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().transform((str) => new Date(str)),
  email: z.string().email(),
  phoneNumber: z.string(),
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
  idType: z.enum(['passport', 'national_id', 'drivers_license']),
  idNumber: z.string(),
  idDocumentUrl: z.string(),
  proofOfAddressUrl: z.string(),
  selfieUrl: z.string()
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await req.json();
    const validatedData = KYCFormSchema.parse(formData);

    const newKYC = await db.insert(kyc)
      .values({
        id: uuidv4(),
        userId,
        ...validatedData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    // Send email to user
    await resend.emails.send({
      from: 'Omnicom Finance <noreply@omnicom.com.im>',
      to: validatedData.email,
      subject: 'KYC Submission Confirmation',
      react: KYCEmail({
        userFirstName: validatedData.firstName,
        status: 'pending',
        submissionDate: new Date().toLocaleString(),
        kycId: newKYC[0].id
      })
    });

    // Send notification to admin
    await resend.emails.send({
      from: 'Omnicom Finance <noreply@omnicom.com.im>',
      to: 'OMNICOM_FINANCE_LTD@outlook.com',
      subject: `New KYC Submission - ${validatedData.email}`,
      react: KYCEmail({
        userFirstName: validatedData.firstName,
        status: 'pending',
        submissionDate: new Date().toLocaleString(),
        kycId: newKYC[0].id,
        isAdminCopy: true
      })
    });

    return NextResponse.json({
      kyc: newKYC[0],
      message: 'KYC submitted successfully'
    });

  } catch (error) {
    console.error('KYC submission error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors }, 
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit KYC" }, 
      { status: 500 }
    );
  }
}
