// import {
//   PrismaClient,
//   InvestmentStatusEnum,
//   InvestmentPlanName,
// } from "@prisma/client";

// import { prisma } from "@/lib/db/prisma";
// export async function createUserInvestments(userId: string) {
//   const plans = Object.values(InvestmentPlanName);
//   const statuses = Object.values(InvestmentStatusEnum);

//   const investments = [];

//   for (let i = 0; i < 20; i++) {
//     const randomPlan = plans[Math.floor(Math.random() * plans.length)];
//     const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
//     const randomDate = new Date(
//       Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
//     );

//     const investment = await prisma.investment.create({
//       data: {
//         userId,
//         planId:
//           (
//             await prisma.investmentPlan.findFirst({
//               where: { name: randomPlan },
//             })
//           )?.id || "",
//         status: {
//           create: {
//             status: randomStatus,
//           },
//         },
//         createdAt: randomDate,
//         updatedAt: randomDate,
//         startIncrease: randomStatus === InvestmentStatusEnum.CONFIRMED,
//         dateToStartIncrease:
//           randomStatus === InvestmentStatusEnum.CONFIRMED
//             ? randomDate
//             : undefined,
//       },
//     });

//     investments.push(investment);
//   }

//   return investments;
// }
