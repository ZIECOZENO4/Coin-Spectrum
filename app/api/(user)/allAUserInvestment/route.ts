import { getUserId } from "./../../../../lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  console.log("Received GET request for investments API");
  const { searchParams } = req.nextUrl;
  const userId = getUserId();
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  console.log("Query parameters:", { userId, page, limit });

  try {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    console.log(
      `Calculated pagination: pageNumber=${pageNumber}, pageSize=${pageSize}, skip=${skip}`
    );

    console.log("Fetching investments from database...");
    const investments = await prisma.investment.findMany({
      where: {
        userId,
      },
      take: pageSize,
      skip: skip,
      include: {
        plan: true, // Include the whole plan
        status: true,
      },
    });

    console.log("Fetched investments:", investments);
    console.log("Counting total investments for pagination...");
    const totalInvestments = await prisma.investment.count({
      where: {
        userId,
      },
    });

    const totalPages = Math.ceil(totalInvestments / pageSize);
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
