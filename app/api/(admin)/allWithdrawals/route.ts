// withdrawals-api-route.ts
import { NextRequest, NextResponse } from "next/server";
import { Prisma, WithdrawalStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
enum SortOption {
  CreatedAtAsc = "createdAtAsc",
  CreatedAtDesc = "createdAtDesc",
}

export async function GET(req: NextRequest) {
  console.log("Received GET request for withdrawals API");
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const sort =
    (searchParams.get("sort") as SortOption) || SortOption.CreatedAtDesc;
  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("statusFilter") || "";

  console.log("Query parameters:");
  console.log("- page:", page);
  console.log("- limit:", limit);
  console.log("- sort:", sort);
  console.log("- search:", search);
  console.log("- statusFilter:", statusFilter);

  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    console.log(
      `Calculated pagination: pageNumber=${pageNumber}, pageSize=${pageSize}, skip=${skip}`
    );

    let statusWhereCondition: WithdrawalStatus | undefined;
    if (statusFilter) {
      statusWhereCondition = statusFilter as WithdrawalStatus;
      console.log("Status filter condition:", statusWhereCondition);
    } else {
      console.log("No status filter provided");
    }

    let orderBy: Prisma.WithdrawalOrderByWithRelationInput;
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

    console.log("Fetching withdrawals from database...");
    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        user: { fullName: { contains: search, mode: "insensitive" } },
        status: statusWhereCondition,
      },
      take: pageSize,
      skip: skip,
      orderBy,
      include: {
        user: true,
      },
    });

    console.log("Counting total withdrawals for pagination...");
    const totalWithdrawals = await prisma.withdrawal.count({
      where: {
        user: { fullName: { contains: search, mode: "insensitive" } },
        status: statusWhereCondition,
      },
    });

    const totalPages = Math.ceil(totalWithdrawals / pageSize);

    console.log("Sending response with withdrawals and total pages");
    return NextResponse.json({ withdrawals, totalPages });
  } catch (error) {
    console.error("Error occurred while fetching withdrawals:", error);
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
