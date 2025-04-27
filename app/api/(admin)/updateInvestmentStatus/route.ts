// import { NextRequest, NextResponse } from "next/server";
// import {
//   InvestmentStatusEnum,
//   PrismaClient,
//   TransactionType,
// } from "@prisma/client";

// import { prisma } from "@/lib/db/prisma";
// import { createTransactionHistory } from "@/lib/createHistory";
// import {
//   createInvestmentTracker,
//   createUserTracker,
// } from "@/app/_action/prisma-core-functionns";


// export async function POST(request: NextRequest, response: NextResponse) {
//   const { searchParams } = new URL(request.url);
//   const investmentId = searchParams.get("id");

//   if (!investmentId) {
//     console.log("Investment ID is missing");
//     return NextResponse.json(
//       { error: "Investment ID is required" },
//       { status: 400 }
//     );
//   }

//   const { status } = await request.json();

//   try {
//     console.log(`Updating investment status for investment ${investmentId}`);

//     // Retrieve the existing investment
//     const existingInvestment = await prisma.investment.findUnique({
//       where: { id: investmentId },
//     });

//     if (!existingInvestment) {
//       console.log(`Investment with ID ${investmentId} not found`);
//       return NextResponse.json(
//         { error: "Investment not found" },
//         { status: 404 }
//       );
//     }

//     let startIncrease = existingInvestment.startIncrease;
//     let dateToStartIncrease = existingInvestment.dateToStartIncrease;

//     if (status === InvestmentStatusEnum.CONFIRMED) {
//       console.log("Investment status is confirmed");

//       if (!existingInvestment.startIncrease) {
//         console.log(
//           "Setting startIncrease to true and dateToStartIncrease to current date"
//         );
//         startIncrease = true;
//         dateToStartIncrease = new Date();
//       }

//       console.log("Creating user tracker");
//       await createUserTracker(existingInvestment.userId);

//       console.log("Creating investment tracker");
//       await createInvestmentTracker(investmentId);
//     } else if (
//       status === InvestmentStatusEnum.SOLD ||
//       status !== InvestmentStatusEnum.CONFIRMED
//     ) {
//       console.log("Investment status is not confirmed or is sold");
//       startIncrease = false;
//     }

//     // Update the investment status in the database
//     const updatedInvestment = await prisma.investment.update({
//       where: { id: investmentId },
//       data: {
//         status: {
//           upsert: {
//             create: { status },
//             update: { status },
//           },
//         },
//         startIncrease,
//         dateToStartIncrease,
//       },
//     });
//     const transactionHistory = await createTransactionHistory({
//       type: TransactionType.NEUTRAL,
//       amount: 0,
//       description: "Investment Confirmed By Admin",
//       userId: existingInvestment.userId,
//       investmentId: existingInvestment.id,
//     });

//     console.log("Investment status updated successfully");
//     return NextResponse.json(
//       { message: "Investment status updated successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating investment status:", error);
//     return NextResponse.json(
//       { error: "Failed to update investment status" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
// export const revalidate = 0;


import { NextRequest, NextResponse } from "next/server";
import { InvestmentStatusEnum, TransactionType } from "@/lib/db/schema"; // Adjust import path as needed
import { db } from "@/lib/db";
import { investments, investmentStatuses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createTransactionHistory } from "@/lib/createHistory";
import {
  createInvestmentTracker,
  createUserTracker,
} from "../../../../app/_action/prisma-core-functionns"; // Assume these functions are updated to use Drizzle

export async function POST(request: NextRequest, response: NextResponse) {
  const { searchParams } = new URL(request.url);
  const investmentId = searchParams.get("id");

  if (!investmentId) {
    return NextResponse.json(
      { error: "Investment ID is required" },
      { status: 400 }
    );
  }

  const { status } = await request.json();

  try {

    // Retrieve the existing investment
    const existingInvestment = await db.query.investments.findFirst({
      where: eq(investments.id, investmentId),
    });

    if (!existingInvestment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    let startIncrease = existingInvestment.startIncrease;
    let dateToStartIncrease = existingInvestment.dateToStartIncrease;

    if (status === InvestmentStatusEnum.CONFIRMED) {

      if (!existingInvestment.startIncrease) {
     
        startIncrease = true;
        dateToStartIncrease = new Date();
      }

      await createUserTracker(existingInvestment.userId);

      await createInvestmentTracker(investmentId);
    } else if (
      status === InvestmentStatusEnum.SOLD ||
      status !== InvestmentStatusEnum.CONFIRMED
    ) {
      startIncrease = false;
    }

    // Update the investment status in the database
    const updatedInvestment = await db.transaction(async (tx) => {
      await tx
        .insert(investmentStatuses)
        .values({ investmentId, status })
        .onConflictDoUpdate({
          target: [investmentStatuses.investmentId],
          set: { status },
        });

      return await tx
        .update(investments)
        .set({
          startIncrease,
          dateToStartIncrease,
        })
        .where(eq(investments.id, investmentId))
        .returning();
    });

    await createTransactionHistory({
      type: TransactionType.NEUTRAL,
      amount: 0,
      description: "Investment Confirmed By Admin",
      userId: existingInvestment.userId,
      investmentId: existingInvestment.id,
    });
    return NextResponse.json(
      { message: "Investment status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating investment status:", error);
    return NextResponse.json(
      { error: "Failed to update investment status" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;
