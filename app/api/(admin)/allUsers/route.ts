// app/api/allInvestments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  Prisma,
  InvestmentStatusEnum,
  InvestmentPlanName,
  User,
  Investment,
  InvestmentPlan,
  InvestmentStatus,
} from "@prisma/client";

enum SortOption {
  CreatedAtAsc = "createdAtAsc",
  CreatedAtDesc = "createdAtDesc",
}

export async function GET(req: NextRequest) {
  console.log("Received GET request for users API");
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const sort =
    (searchParams.get("sort") as SortOption) || SortOption.CreatedAtDesc;
  const search = searchParams.get("search") || "";

  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    console.log(
      `Calculated pagination: pageNumber=${pageNumber}, pageSize=${pageSize}, skip=${skip}`
    );

    let orderBy: Prisma.UserOrderByWithRelationInput;
    switch (sort) {
      case SortOption.CreatedAtAsc:
        orderBy = { createdAt: "asc" };
        break;
      case SortOption.CreatedAtDesc:
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" }; // Default sort option
    }

    console.log("Fetching users and their investments from database...");
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      take: pageSize,
      skip: skip,
      orderBy,
      include: {
        investments: {
          include: {
            plan: {
              select: {
                name: true,
                price: true,
              },
            },
            status: true,
          },
        },
      },
    });

    console.log("Users fetched:", users);

    console.log("Counting total users for pagination...");
    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    const totalPages = Math.ceil(totalUsers / pageSize);

    const usersWithInvestmentDetails = users.map((user) => {
      const confirmedInvestments = user.investments.filter(
        (investment) =>
          investment.status?.status === InvestmentStatusEnum.CONFIRMED
      );
      const unconfirmedInvestments = user.investments.filter(
        (investment) =>
          investment.status?.status === InvestmentStatusEnum.NOT_CONFIRMED
      );

      const totalConfirmedInvestmentAmount = confirmedInvestments.reduce(
        (total, investment) => total + investment.plan.price,
        0
      );
      const totalUnconfirmedInvestmentAmount = unconfirmedInvestments.reduce(
        (total, investment) => total + investment.plan.price,
        0
      );

      return {
        ...user,
        confirmedInvestments,
        unconfirmedInvestments,
        totalConfirmedInvestmentAmount,
        totalUnconfirmedInvestmentAmount,
      };
    });

    return NextResponse.json({ users: usersWithInvestmentDetails, totalPages });
  } catch (error) {
    console.error("Error occurred while fetching users:", error);
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    console.log("Sending error response...");
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
export const revalidate = 0;
