// /app/api/investments/route.ts
/**
 * This TypeScript function handles a GET request to retrieve investment data based on an ID using
 * Prisma and returns appropriate responses for different scenarios.
 * @param {Request} request - The code snippet you provided is a TypeScript function that handles a GET
 * request. Let me explain the parameters used in the function:
 * @returns The code is returning a JSON response based on the conditions met during the execution of
 * the `GET` function:
 * 1. If the `id` parameter is missing in the request, it returns a JSON response with an error message
 * "ID is required" and a status code of 400.
 * 2. If the investment with the provided `id` is not found in the database, it returns a JSON
 */

// import { prisma } from "@/lib/db/prisma";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");

//   if (!id) {
//     return NextResponse.json({ error: "ID is required" }, { status: 400 });
//   }

//   try {
//     const investment = await prisma.withdrawal.findUnique({
//       where: { id },
//       include: {
//         user: true,
//       },
//     });

//     if (!investment) {
//       return NextResponse.json(
//         { error: "Investment not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(investment);
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "An error occurred" },
//       { status: 500 }
//     );
//   }
// }

import { db } from "@/lib/db";
import { withdrawals, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const withdrawal = await db.query.withdrawals.findFirst({
      where: eq(withdrawals.id, id),
      with: {
        user: true,
      },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(withdrawal);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
