// app/api/getAnInvestmentPlan/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, InvestmentPlan, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idParam = url.searchParams.get("id");

  console.log("Received request to fetch investment plan with id:", idParam);

  if (!idParam) {
    console.error("No id provided in query params");
    return NextResponse.json({ error: "No id provided" }, { status: 400 });
  }

  try {
    const investmentPlan = await fetchInvestmentPlan(idParam);

    if (!investmentPlan) {
      console.log("Investment plan not found with id:", idParam);
      return NextResponse.json({ error: "Investment plan not found" }, { status: 404 });
    }

    console.log("Investment plan found:", investmentPlan);
    return NextResponse.json(investmentPlan);
  } catch (error) {
    console.error("Error fetching investment plan:", error);
    return handleError(error);
  }
}

async function fetchInvestmentPlan(id: string): Promise<InvestmentPlan | null> {
  return await prisma.investmentPlan.findUnique({
    where: { id },
  });
}

function handleError(error: unknown): NextResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error("Prisma error:", error.message);
    return NextResponse.json({ error: "Database error occurred" }, { status: 500 });
  } else if (error instanceof Error) {
    console.error("Unexpected error:", error.message);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  } else {
    console.error("Unknown error:", error);
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
