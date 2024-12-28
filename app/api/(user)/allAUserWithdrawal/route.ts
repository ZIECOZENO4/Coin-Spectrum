import { getUserId } from "./../../../../lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  console.log("Received GET request for withdrawals API");
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

    console.log("Fetching withdrawals from database...");
    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        userId,
      },
      take: pageSize,
      skip: skip,
      include: {
        user: true, // Include the user details if needed
      },
    });

    console.log("Fetched withdrawals:", withdrawals);
    console.log("Counting total withdrawals for pagination...");
    const totalWithdrawals = await prisma.withdrawal.count({
      where: {
        userId,
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
