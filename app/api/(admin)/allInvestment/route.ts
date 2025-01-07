

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db/prisma";
// import {
//   Prisma,
//   InvestmentStatusEnum,
//   InvestmentPlanName,
// } from "@prisma/client";

// enum SortOption {
//   CreatedAtAsc = "createdAtAsc",
//   CreatedAtDesc = "createdAtDesc",
// }

// export async function GET(req: NextRequest) {
//   console.log("Received GET request for investments API");
//   const { searchParams } = req.nextUrl;
//   const page = searchParams.get("page") || "1";
//   const limit = searchParams.get("limit") || "10";
//   const sort =
//     (searchParams.get("sort") as SortOption) || SortOption.CreatedAtDesc;
//   const search = searchParams.get("search") || "";
//   const statusFilter = searchParams.get("statusFilter") || "";
//   const planFilter = searchParams.get("planFilter") || "";

//   console.log("Query parameters:");
//   console.log("- page:", page);
//   console.log("- limit:", limit);
//   console.log("- sort:", sort);
//   console.log("- search:", search);
//   console.log("- statusFilter:", statusFilter);
//   console.log("- planFilter:", planFilter);

//   try {
//     const pageNumber = parseInt(page);
//     const pageSize = parseInt(limit);
//     const skip = (pageNumber - 1) * pageSize;

//     console.log(
//       `Calculated pagination: pageNumber=${pageNumber}, pageSize=${pageSize}, skip=${skip}`
//     );

//     let statusWhereCondition: InvestmentStatusEnum | undefined;
//     if (statusFilter) {
//       statusWhereCondition = statusFilter as InvestmentStatusEnum;
//       console.log("Status filter condition:", statusWhereCondition);
//     } else {
//       console.log("No status filter provided");
//     }

//     let planWhereCondition: InvestmentPlanName | undefined;
//     if (planFilter) {
//       planWhereCondition = planFilter as InvestmentPlanName;
//       console.log("Plan filter condition:", planWhereCondition);
//     } else {
//       console.log("No plan filter provided");
//     }

//     let orderBy: Prisma.InvestmentOrderByWithRelationInput;
//     switch (sort) {
//       case SortOption.CreatedAtAsc:
//         orderBy = { createdAt: "asc" };
//         console.log("Sorting by createdAt in ascending order");
//         break;
//       case SortOption.CreatedAtDesc:
//         orderBy = { createdAt: "desc" };
//         console.log("Sorting by createdAt in descending order");
//         break;
//       default:
//         orderBy = { updatedAt: "desc" }; // Default sort option
//         console.log("Sorting by createdAt in descending order (default)");
//     }

//     console.log("Fetching investments from database...");
//     const investments = await prisma.investment.findMany({
//       where: {
//         OR: [
//           { user: { fullName: { contains: search, mode: "insensitive" } } },
//           { user: { email: { contains: search, mode: "insensitive" } } },
//         ],
//         plan: planWhereCondition ? { name: planWhereCondition } : undefined,
//         status: statusWhereCondition
//           ? { status: statusWhereCondition }
//           : undefined,
//       },
//       take: pageSize,
//       skip: skip,
//       orderBy,
//       include: {
//         user: true, // Return all user fields
//         plan: {
//           select: {
//             name: true,
//           },
//         },
//         status: true,
//       },
//     });
//     console.log("Fetched investments:", investments);
//     console.log("Counting total investments for pagination...");
//     const totalInvestments = await prisma.investment.count({
//       where: {
//         OR: [
//           { user: { fullName: { contains: search, mode: "insensitive" } } },
//           { user: { email: { contains: search, mode: "insensitive" } } },
//         ],
//         plan: planWhereCondition ? { name: planWhereCondition } : undefined,
//         status: statusWhereCondition
//           ? { status: statusWhereCondition }
//           : undefined,
//       },
//     });

//     const totalPages = Math.ceil(totalInvestments / pageSize);
//     console.log("this is all of the investments", investments);
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


import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  investments, 
  users, 
  investmentPlans, 
  investmentStatuses 
} from "@/lib/db/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";

enum SortOption {
  CreatedAtAsc = "createdAtAsc",
  CreatedAtDesc = "createdAtDesc",
}

export async function GET(req: NextRequest) {
  console.log("Received GET request for investments API");
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const sort = (searchParams.get("sort") as SortOption) || SortOption.CreatedAtDesc;
  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("statusFilter") || "";
  const planFilter = searchParams.get("planFilter") || "";

  console.log("Query parameters:", { page, limit, sort, search, statusFilter, planFilter });

  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    console.log(`Calculated pagination: pageNumber=${pageNumber}, pageSize=${pageSize}, skip=${skip}`);

    let whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(users.fullName, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    if (statusFilter) {
      whereConditions.push(eq(investmentStatuses.status, statusFilter));
    }

    if (planFilter) {
      whereConditions.push(eq(investmentPlans.name, planFilter));
    }

    let orderByClause;
    switch (sort) {
      case SortOption.CreatedAtAsc:
        orderByClause = asc(investments.createdAt);
        console.log("Sorting by createdAt in ascending order");
        break;
      case SortOption.CreatedAtDesc:
        orderByClause = desc(investments.createdAt);
        console.log("Sorting by createdAt in descending order");
        break;
      default:
        orderByClause = desc(investments.updatedAt);
        console.log("Sorting by updatedAt in descending order (default)");
    }

    console.log("Fetching investments from database...");
    const fetchedInvestments = await db
      .select({
        investment: investments,
        user: users,
        plan: investmentPlans.name,
        status: investmentStatuses,
      })
      .from(investments)
      .leftJoin(users, eq(investments.userId, users.id))
      .leftJoin(investmentPlans, eq(investments.planId, investmentPlans.id))
      .leftJoin(investmentStatuses, eq(investments.statusId, investmentStatuses.id))
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(skip);

    console.log("Fetched investments:", fetchedInvestments);

    console.log("Counting total investments for pagination...");
    const totalInvestmentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(investments)
      .leftJoin(users, eq(investments.userId, users.id))
      .leftJoin(investmentPlans, eq(investments.planId, investmentPlans.id))
      .leftJoin(investmentStatuses, eq(investments.statusId, investmentStatuses.id))
      .where(and(...whereConditions));

    const totalInvestments = totalInvestmentsResult[0].count;
    const totalPages = Math.ceil(totalInvestments / pageSize);

    console.log("Sending response with investments and total pages");
    return NextResponse.json({ investments: fetchedInvestments, totalPages });
  } catch (error) {
    console.error("Error occurred while fetching investments:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Sending error response with message:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const revalidate = 0;
