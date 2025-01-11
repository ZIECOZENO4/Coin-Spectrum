import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  investments, 
  investmentPlans, 
  investmentStatuses, 
  imageProofs, 
  users 
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";

// Assuming you've defined these in your schema
import { InvestmentStatusEnum, Wallets } from "@/lib/db/schema";

export interface CreateInvestmentData {
  userName: string;
  userEmail: string;
  transactionId: string;
  id: string;
  amount: number;
  imageUrl: string;
  imageId: string;
  crypto: Wallets;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    console.log("Received request body:", req.body);

    const {
      userName,
      userEmail,
      transactionId,
      id,
      amount,
      imageUrl,
      imageId,
      crypto,
    }: CreateInvestmentData = await req.json();

    if (!crypto || !Object.values(Wallets).includes(crypto)) {
      console.error("Invalid or no crypto provided by you");
      return NextResponse.json(
        { error: "Invalid or no crypto provided" },
        { status: 400 }
      );
    }

    if (!id || !Object.values(id).includes(id)) {
      console.error("Invalid or no investment plan name provided");
      return NextResponse.json(
        { error: "Invalid or no investment plan name provided" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !userName ||
      !userEmail ||
      !transactionId ||
      !id ||
      !amount ||
      !imageUrl ||
      !imageId ||
      !crypto
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { session } = await getUserAuth();
    const userId = session?.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const investmentPlan = await db.query.investmentPlans.findFirst({
      where: eq(investmentPlans.id, id),
    });

    if (!investmentPlan) {
      throw new Error(`Investment plan ${id} not found`);
    }

    const investment = await db.transaction(async (tx) => {
      const [createdInvestment] = await tx
        .insert(investments)
        .values({
          userId,
          transactionId,
          name: userName,
          email: userEmail,
          walletPaidInto: crypto,
          planId: investmentPlan.id,
        })
        .returning();

      await tx.insert(investmentStatuses).values({
        investmentId: createdInvestment.id,
        status: InvestmentStatusEnum.NOT_CONFIRMED,
      });

      await tx.insert(imageProofs).values({
        id: imageId,
        url: imageUrl,
        investmentId: createdInvestment.id,
      });

      return createdInvestment;
    });

    console.log("Investment created:", investment);
    return NextResponse.json(investment, { status: 201 });
  } catch (error: any) {
    console.error("Error creating investment:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
