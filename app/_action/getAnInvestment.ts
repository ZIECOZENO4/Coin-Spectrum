// import { prisma } from "@/lib/db/prisma";

// // Function to get investment details along with image proof and investment plan details
// export async function getInvestmentDetails(investmentId: string) {
//   const investment = await prisma.investment.findUnique({
//     where: { id: investmentId },
//     include: {
//       imageProofUrl: true, // Fetches all related image proofs
//       plan: true, // Fetches the related investment plan
//       user: true,
//       status: true,
//     },
//   });

//   if (!investment) {
//     throw new Error("Investment not found");
//   }

//   return investment;
// }


import { db } from "@/lib/db";
import { investments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Function to get investment details along with image proof and investment plan details
export async function getInvestmentDetails(investmentId: string) {
  const investment = await db.query.investments.findFirst({
    where: eq(investments.id, investmentId),
    with: {
      imageProofs: true,
      plan: true,
      user: true,
      status: true,
    },
  });

  if (!investment) {
    throw new Error("Investment not found");
  }

  return investment;
}
