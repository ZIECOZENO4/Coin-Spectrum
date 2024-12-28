import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    console.log("Attempting to fetch investments...");
    
    const count = await prisma.investmentPlan.count();
    console.log("Number of investment plans:", count);

    const investments = await prisma.investmentPlan.findMany();
    console.log("Investments fetched:", investments);
    
    if (investments.length === 0) {
      console.log("Warning: No investment plans found in the database.");
    }

    return NextResponse.json(investments);
  } catch (error: any) {
    console.error("Error fetching investments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
