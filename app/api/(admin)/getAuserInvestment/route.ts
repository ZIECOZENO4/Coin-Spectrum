// /app/api/investments/route.ts

import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const investment = await prisma.investment.findUnique({
      where: { id },
      include: {
        imageProofUrl: true,
        plan: true,
        user: true,
        status: true,
      },
    });

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(investment);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
