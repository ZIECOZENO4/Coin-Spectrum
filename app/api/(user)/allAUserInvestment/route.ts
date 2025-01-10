// import { getUserId } from "./../../../../lib/auth/utils";
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db/prisma";

// export async function GET(req: NextRequest) {
//   console.log("Received GET request for investments API");
//   const { searchParams } = req.nextUrl;
//   const userId = getUserId();
//   const page = searchParams.get("page") || "1";
//   const limit = searchParams.get("limit") || "10";

//   if (!userId) {
//     return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//   }

//   console.log("Query parameters:", { userId, page, limit });

//   try {
//     const pageNumber = parseInt(page);
//     const pageSize = parseInt(limit);
//     const skip = (pageNumber - 1) * pageSize;

//     console.log(
//       `Calculated pagination: pageNumber=${pageNumber}, pageSize=${pageSize}, skip=${skip}`
//     );

//     console.log("Fetching investments from database...");
//     const investments = await prisma.investment.findMany({
//       where: {
//         userId,
//       },
//       take: pageSize,
//       skip: skip,
//       include: {
//         plan: true, // Include the whole plan
//         status: true,
//       },
//     });

//     console.log("Fetched investments:", investments);
//     console.log("Counting total investments for pagination...");
//     const totalInvestments = await prisma.investment.count({
//       where: {
//         userId,
//       },
//     });

//     const totalPages = Math.ceil(totalInvestments / pageSize);
//     console.log("Sending response with investments and total pages");
//     return NextResponse.json({ investments, totalPages });
//   } catch (error) {
//     console.error("Error occurred while fetching investments:", error);
//     let errorMessage = "";
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else {
//       errorMessage = String(error);
//     }
//     console.log("Sending error response with message:", errorMessage);
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }

// export const revalidate = 0;

import { getUserId } from "./../../../../lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { investments, investmentPlans, investmentStatuses } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  console.log("Received GET request for investments API");
  const { searchParams } = req.nextUrl;
  const userId = getUserId();
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "10";

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" }, 
      { status: 400 }
    );
  }

  try {
    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * pageSize;

    const [fetchedInvestments, totalInvestmentsResult] = await Promise.all([
      db.select({
        id: investments.id,
        name: investments.name,
        price: investments.price,
        profitPercent: investments.profitPercent,
        rating: investments.rating,
        principalReturn: investments.principalReturn,
        principalWithdraw: investments.principalWithdraw,
        creditAmount: investments.creditAmount,
        depositFee: investments.depositFee,
        debitAmount: investments.debitAmount,
        durationDays: investments.durationDays,
        createdAt: investments.createdAt,
        updatedAt: investments.updatedAt,
        plan: {
          id: investmentPlans.id,
          name: investmentPlans.name,
          minAmount: investmentPlans.minAmount,
          maxAmount: investmentPlans.maxAmount,
          roi: investmentPlans.roi,
          durationHours: investmentPlans.durationHours,
          instantWithdrawal: investmentPlans.instantWithdrawal
        },
        status: {
          id: investmentStatuses.id,
          status: investmentStatuses.status
        }
      })
      .from(investments)
      .leftJoin(
        investmentPlans, 
        eq(investments.id, investmentPlans.id)
      )
      .leftJoin(
        investmentStatuses, 
        eq(investments.id, investmentStatuses.id)
      )
      .limit(pageSize)
      .offset(skip),

      db.select({ 
        count: sql<number>`cast(count(*) as integer)` 
      })
      .from(investments)
    ]);

    if (!fetchedInvestments) {
      throw new Error("Failed to fetch investments");
    }

    const totalInvestments = totalInvestmentsResult[0]?.count ?? 0;
    const totalPages = Math.ceil(totalInvestments / pageSize);

    return NextResponse.json({
      investments: fetchedInvestments.map(inv => ({
        ...inv,
        plan: inv.plan ?? null,
        status: inv.status ?? null
      })),
      totalPages,
      currentPage: pageNumber,
      totalItems: totalInvestments
    });
  } catch (error) {
    console.error("Error fetching investments:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}

export const revalidate = 0;
