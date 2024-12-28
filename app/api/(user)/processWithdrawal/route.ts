import { getUserAuth } from "@/lib/auth/utils";
import { Wallets, WithdrawalStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { processWithdrawal } from "@/app/_action/prisma-core-functionns";
import { formSchema } from "@/app/(user)/dashboard/withdraw/aside";
import { z } from "zod";
// import { processWithdrawal } from "@/app/_action/prisma-core-.test";
export async function POST(request: NextRequest) {
  try {
    const {
      withdrawalAmount,
      cryptoType,
      walletAddress,
    }: z.infer<typeof formSchema> = await request.json();
    if (
      !cryptoType ||
      !Object.values(Wallets).includes(cryptoType as Wallets)
    ) {
      console.error("Invalid or no name provided in query params");
      return NextResponse.json(
        { error: "Invalid or no name provided" },
        { status: 400 }
      );
    }
    const { session } = await getUserAuth();
    const userId = session?.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    if (!withdrawalAmount || !cryptoType || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await processWithdrawal(
      userId,
      withdrawalAmount,
      walletAddress,
      cryptoType as Wallets
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error processing withdrawal: ${error}`);
    return NextResponse.json(
      { error: `${error || "An unexpected error occurred"}` },
      { status: 500 }
    );
  }
}

// pages/api/withdrawals.ts

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const withdrawalStatusFilter = searchParams.get(
      "withdrawalStatusFilter"
    ) as WithdrawalStatus | undefined;
    console.log("Withdrawal status filter:", withdrawalStatusFilter);

    if (!withdrawalStatusFilter) {
      return NextResponse.json(
        { error: "Missing withdrawalStatusFilter" },
        { status: 400 }
      );
    }

    if (!WithdrawalStatus[withdrawalStatusFilter]) {
      return NextResponse.json(
        { error: "Invalid withdrawalStatusFilter" },
        { status: 400 }
      );
    }

    const { session } = await getUserAuth();
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not logged in" },
        { status: 401 }
      );
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        userId: userId,
        status: withdrawalStatusFilter,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ withdrawals }, { status: 200 });
  } catch (error) {
    console.error("Error occurred while fetching user withdrawals:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
export const revalidate = 0;
