// // app/api/allInvestments/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db/prisma";
// import {
//   Prisma,
//   InvestmentStatusEnum,
//   InvestmentPlanName,
//   User,
//   Investment,
//   InvestmentPlan,
//   InvestmentStatus,
// } from "@prisma/client";

// enum SortOption {
//   CreatedAtAsc = "createdAtAsc",
//   CreatedAtDesc = "createdAtDesc",
// }

// export async function GET(req: NextRequest) {
//   console.log("Received GET request for users API");
//   const { searchParams } = req.nextUrl;
//   const page = searchParams.get("page") || "1";
//   const limit = searchParams.get("limit") || "10";
//   const sort =
//     (searchParams.get("sort") as SortOption) || SortOption.CreatedAtDesc;
//   const search = searchParams.get("search") || "";

//   try {
//     const pageNumber = parseInt(page);
//     const pageSize = parseInt(limit);
//     const skip = (pageNumber - 1) * pageSize;

//     console.log(
//       `Calculated pagination: pageNumber=${pageNumber}, pageSize=${pageSize}, skip=${skip}`
//     );

//     let orderBy: Prisma.UserOrderByWithRelationInput;
//     switch (sort) {
//       case SortOption.CreatedAtAsc:
//         orderBy = { createdAt: "asc" };
//         break;
//       case SortOption.CreatedAtDesc:
//         orderBy = { createdAt: "desc" };
//         break;
//       default:
//         orderBy = { createdAt: "desc" }; // Default sort option
//     }

//     console.log("Fetching users and their investments from database...");
//     const users = await prisma.user.findMany({
//       where: {
//         OR: [
//           { fullName: { contains: search, mode: "insensitive" } },
//           { email: { contains: search, mode: "insensitive" } },
//         ],
//       },
//       take: pageSize,
//       skip: skip,
//       orderBy,
//       include: {
//         investments: {
//           include: {
//             plan: {
//               select: {
//                 name: true,
//                 price: true,
//               },
//             },
//             status: true,
//           },
//         },
//       },
//     });

//     console.log("Users fetched:", users);

//     console.log("Counting total users for pagination...");
//     const totalUsers = await prisma.user.count({
//       where: {
//         OR: [
//           { fullName: { contains: search, mode: "insensitive" } },
//           { email: { contains: search, mode: "insensitive" } },
//         ],
//       },
//     });

//     const totalPages = Math.ceil(totalUsers / pageSize);

//     const usersWithInvestmentDetails = users.map((user) => {
//       const confirmedInvestments = user.investments.filter(
//         (investment) =>
//           investment.status?.status === InvestmentStatusEnum.CONFIRMED
//       );
//       const unconfirmedInvestments = user.investments.filter(
//         (investment) =>
//           investment.status?.status === InvestmentStatusEnum.NOT_CONFIRMED
//       );

//       const totalConfirmedInvestmentAmount = confirmedInvestments.reduce(
//         (total, investment) => total + investment.plan.price,
//         0
//       );
//       const totalUnconfirmedInvestmentAmount = unconfirmedInvestments.reduce(
//         (total, investment) => total + investment.plan.price,
//         0
//       );

//       return {
//         ...user,
//         confirmedInvestments,
//         unconfirmedInvestments,
//         totalConfirmedInvestmentAmount,
//         totalUnconfirmedInvestmentAmount,
//       };
//     });

//     return NextResponse.json({ users: usersWithInvestmentDetails, totalPages });
//   } catch (error) {
//     console.error("Error occurred while fetching users:", error);
//     let errorMessage = "";
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else {
//       errorMessage = String(error);
//     }
//     console.log("Sending error response...");
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }
// export const revalidate = 0;


// app/api/allInvestments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  users, 
  investments, 
  investmentPlans, 
  investmentStatuses 
} from "@/lib/db/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";

enum SortOption {
  CreatedAtAsc = "createdAtAsc",
  CreatedAtDesc = "createdAtDesc",
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "100000";
  const sort = (searchParams.get("sort") as SortOption) || SortOption.CreatedAtDesc;
  const search = searchParams.get("search") || "";

  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;


    let orderByClause;
    switch (sort) {
      case SortOption.CreatedAtAsc:
        orderByClause = asc(users.createdAt);
        break;
      case SortOption.CreatedAtDesc:
        orderByClause = desc(users.createdAt);
        break;
      default:
        orderByClause = desc(users.createdAt);
    }

    const fetchedUsers = await db
      .select({
        user: users,
        investment: investments,
        plan: investmentPlans,
        status: investmentStatuses,
      })
      .from(users)
      .leftJoin(investments, eq(investments.userId, users.id))
      .leftJoin(investmentPlans, eq(investments.planId, investmentPlans.id))
      .leftJoin(investmentStatuses, eq(investments.statusId, investmentStatuses.id))
      .where(
        or(
          ilike(users.fullName, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      )
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(skip);
    const totalUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        or(
          ilike(users.fullName, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );

    const totalUsers = totalUsersResult[0].count;
    const totalPages = Math.ceil(totalUsers / pageSize);

    const usersWithInvestmentDetails = fetchedUsers.reduce((acc, row) => {
      if (!acc[row.user.id]) {
        acc[row.user.id] = {
          ...row.user,
          investments: [],
          confirmedInvestments: [],
          unconfirmedInvestments: [],
          totalConfirmedInvestmentAmount: 0,
          totalUnconfirmedInvestmentAmount: 0,
        };
      }
      
      if (row.investment) {
        acc[row.user.id].investments.push({
          ...row.investment,
          plan: row.plan,
          status: row.status,
        });
        
        if (row.status?.status === 'CONFIRMED') {
          acc[row.user.id].confirmedInvestments.push(row.investment);
          acc[row.user.id].totalConfirmedInvestmentAmount += row.plan?.price || 0;
        } else if (row.status?.status === 'NOT_CONFIRMED') {
          acc[row.user.id].unconfirmedInvestments.push(row.investment);
          acc[row.user.id].totalUnconfirmedInvestmentAmount += row.plan?.price || 0;
        }
      }
      
      return acc;
    }, {});

    return NextResponse.json({ 
      users: Object.values(usersWithInvestmentDetails), 
      totalPages 
    });
  } catch (error) {
    console.error("Error occurred while fetching users:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const revalidate = 0;
