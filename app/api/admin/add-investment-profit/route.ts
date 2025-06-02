import { db } from "@/lib/db";
import {
  userInvestments,
  users,
  investments,
  investmentProfitPayouts,
  transactionHistory,
  TransactionTypeEnum
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId, orgId, has } = auth();

    // Ensure admin privileges if necessary
    // if (!has || !has({ permission: "org:admin" })) { // Example check
    //   return new Response("Unauthorized", { status: 401 });
    // }

    const { userInvestmentId, amount } = await req.json(); // Destructure amount from request

    if (!userInvestmentId) {
      return new Response("Missing userInvestmentId", { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) { // Validate amount
      return new Response("Invalid or missing profit amount", { status: 400 });
    }

    // Fetch the user investment details
    const userInvestment = await db.query.userInvestments.findFirst({
      where: eq(userInvestments.id, userInvestmentId),
      with: {
        investment: true, // Keep if needed for description or other logic
        user: true,       // To get the userIdToUpdate
      },
    });

    if (!userInvestment) {
      return new Response("User investment not found", { status: 404 });
    }

    const userIdToUpdate = userInvestment.userId;
    const investmentName = userInvestment.investment.name; // For description
    const profitAmount = amount; // Use the amount from the request directly

    // Use a transaction to ensure both balance update and payout record are successful
    await db.transaction(async (tx) => {
      // Update the user's balance
      await tx
        .update(users)
        .set({
          balance: sql`${users.balance} + ${profitAmount}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userIdToUpdate));

      // Record the profit payout
      await tx.insert(investmentProfitPayouts).values({
        id: crypto.randomUUID(), // Generate a unique ID
        userId: userIdToUpdate,
        userInvestmentId: userInvestmentId,
        amount: profitAmount, // Use the profitAmount from the request
        payoutDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add a transaction history entry for the profit payout
      await tx.insert(transactionHistory).values({
        id: crypto.randomUUID(), // Generate a unique ID
        userId: userIdToUpdate,
        investmentId: userInvestment.investmentId,
        type: TransactionTypeEnum.InvestmentProfit,
        amount: profitAmount, // Use the profitAmount from the request
        description: `Profit payout for ${investmentName} investment (ID: ${userInvestmentId})`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    return Response.json({ success: true, message: "Profit added to user balance" });

  } catch (error) {
    console.error("Error adding investment profit:", error);
    return new Response("Internal Server Error", {
      status: 500,
      statusText: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
