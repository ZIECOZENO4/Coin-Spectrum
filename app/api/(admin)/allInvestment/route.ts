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
//         user: { fullName: { contains: search, mode: "insensitive" } },
//         plan: planWhereCondition ? { name: planWhereCondition } : undefined,
//         status: statusWhereCondition
//           ? { status: statusWhereCondition }
//           : undefined,
//       },
//       take: pageSize,
//       skip: skip,
//       orderBy,
//       include: {
//         user: {
//           select: {
//             fullName: true,
//           },
//         },
//         plan: {
//           select: {
//             name: true,
//           },
//         },
//         status: true,
//       },
//     });
//     console.log("this is the iinvestments in the backend", investments);
//     console.log("Counting total investments for pagination...");
//     const totalInvestments = await prisma.investment.count({
//       where: {
//         user: { fullName: { contains: search, mode: "insensitive" } },
//         plan: planWhereCondition ? { name: planWhereCondition } : undefined,
//         status: statusWhereCondition
//           ? { status: statusWhereCondition }
//           : undefined,
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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  Prisma,
  InvestmentStatusEnum,
  InvestmentPlanName,
} from "@prisma/client";

enum SortOption {
  CreatedAtAsc = "createdAtAsc",
  CreatedAtDesc = "createdAtDesc",
}

export async function GET(req: NextRequest) {
  console.log("Received GET request for investments API");
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const sort =
    (searchParams.get("sort") as SortOption) || SortOption.CreatedAtDesc;
  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("statusFilter") || "";
  const planFilter = searchParams.get("planFilter") || "";

  console.log("Query parameters:");
  console.log("- page:", page);
  console.log("- limit:", limit);
  console.log("- sort:", sort);
  console.log("- search:", search);
  console.log("- statusFilter:", statusFilter);
  console.log("- planFilter:", planFilter);

  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    console.log(
      `Calculated pagination: pageNumber=${pageNumber}, pageSize=${pageSize}, skip=${skip}`
    );

    let statusWhereCondition: InvestmentStatusEnum | undefined;
    if (statusFilter) {
      statusWhereCondition = statusFilter as InvestmentStatusEnum;
      console.log("Status filter condition:", statusWhereCondition);
    } else {
      console.log("No status filter provided");
    }

    let planWhereCondition: InvestmentPlanName | undefined;
    if (planFilter) {
      planWhereCondition = planFilter as InvestmentPlanName;
      console.log("Plan filter condition:", planWhereCondition);
    } else {
      console.log("No plan filter provided");
    }

    let orderBy: Prisma.InvestmentOrderByWithRelationInput;
    switch (sort) {
      case SortOption.CreatedAtAsc:
        orderBy = { createdAt: "asc" };
        console.log("Sorting by createdAt in ascending order");
        break;
      case SortOption.CreatedAtDesc:
        orderBy = { createdAt: "desc" };
        console.log("Sorting by createdAt in descending order");
        break;
      default:
        orderBy = { updatedAt: "desc" }; // Default sort option
        console.log("Sorting by createdAt in descending order (default)");
    }

    console.log("Fetching investments from database...");
    const investments = await prisma.investment.findMany({
      where: {
        OR: [
          { user: { fullName: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ],
        plan: planWhereCondition ? { name: planWhereCondition } : undefined,
        status: statusWhereCondition
          ? { status: statusWhereCondition }
          : undefined,
      },
      take: pageSize,
      skip: skip,
      orderBy,
      include: {
        user: true, // Return all user fields
        plan: {
          select: {
            name: true,
          },
        },
        status: true,
      },
    });
    console.log("Fetched investments:", investments);
    console.log("Counting total investments for pagination...");
    const totalInvestments = await prisma.investment.count({
      where: {
        OR: [
          { user: { fullName: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ],
        plan: planWhereCondition ? { name: planWhereCondition } : undefined,
        status: statusWhereCondition
          ? { status: statusWhereCondition }
          : undefined,
      },
    });

    const totalPages = Math.ceil(totalInvestments / pageSize);
    console.log("this is all of the investments", investments);
    console.log("Sending response with investments and total pages");
    return NextResponse.json({ investments, totalPages });
  } catch (error) {
    console.error("Error occurred while fetching investments:", error);
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    console.log("Sending error response with message:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const revalidate = 0;
