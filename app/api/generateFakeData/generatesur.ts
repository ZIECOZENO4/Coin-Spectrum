// import { PrismaClient } from "@prisma/client";
// import { prisma } from "@/lib/db";
// import { createInvestmentTracker } from "@/app/action/prisma-core-functions";
// export async function generateVIP1InvestmentPlan(
//   userId: string
// ): Promise<void> {
//   // Retrieve the VIP1 investment plan ID
//   const vip1Plan = await prisma.investmentPlan.findUnique({
//     where: {
//       name: "VIP1",
//     },
//   });

//   if (!vip1Plan) {
//     throw new Error("VIP1 investment plan not found.");
//   }

//   // Create a new investment for the user with the VIP1 plan
//   const investnemt = await prisma.investment.create({
//     data: {
//       userId: userId,
//       planId: vip1Plan.id,
//       startIncrease: true,
//       dateToStartIncrease: new Date(),
//       status: {
//         create: {
//           status: "CONFIRMED", // Adjust this value based on your actual enum values
//         },
//       },
//     },
//   });
//   // await createInvestmentTracker(investnemt.id);
//   console.log("VIP1 investment plan generated successfully.");
// }
