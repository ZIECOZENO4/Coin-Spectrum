// import {
//   PrismaClient,
//   InvestmentStatusEnum,
//   Wallets,
//   InvestmentPlanName,
// } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import { prisma } from "@/lib/db/prisma";
// import { getUserAuth } from "@/lib/auth/utils";

// const getRandomInvestmentPlan = async (): Promise<{
//   id: string;
//   name: InvestmentPlanName;
// }> => {
//   const investmentPlans = await prisma.investmentPlan.findMany({
//     select: { id: true, name: true },
//   });

//   const randomPlan =
//     investmentPlans[Math.floor(Math.random() * investmentPlans.length)];
//   return { id: randomPlan.id, name: randomPlan.name };
// };

// const getRandomWallet = (): Wallets => {
//   const wallets = Object.values(Wallets);
//   return wallets[Math.floor(Math.random() * wallets.length)];
// };

// const generateRandomInvestment = async (
//   userId: string,
//   email: string
// ): Promise<{
//   planId: string;
//   name: InvestmentPlanName;
//   email: string;
//   walletPaidInto: Wallets;
//   transactionId: string;
//   status: InvestmentStatusEnum;
// }> => {
//   const { id: planId, name } = await getRandomInvestmentPlan();

//   return {
//     planId,
//     name,
//     email,
//     walletPaidInto: getRandomWallet(),
//     transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`,
//     status:
//       Math.random() > 0.5
//         ? InvestmentStatusEnum.CONFIRMED
//         : InvestmentStatusEnum.NOT_CONFIRMED,
//   };
// };

// export const createRandomInvestmentsForUser = async (): Promise<void> => {
//   const userAuth = await getUserAuth();

//   if (!userAuth.session) {
//     console.log("No authenticated user found.");
//     return;
//   }

//   const { id: userId, email } = userAuth.session.user;

//   const investmentsData = await Promise.all(
//     Array.from({ length: 20 }, () =>
//       generateRandomInvestment(userId, email as string)
//     )
//   );

//   for (const investmentData of investmentsData) {
//     const investment = await prisma.investment.create({
//       data: {
//         userId,
//         planId: investmentData.planId,
//         name: investmentData.name,
//         email: investmentData.email,
//         walletPaidInto: investmentData.walletPaidInto,
//         transactionId: investmentData.transactionId,
//         imageProofUrl: {
//           create: [
//             {
//               url: `https://example.com/proof_${Math.random()
//                 .toString(36)
//                 .substring(2, 15)}.jpg`,
//               id: uuidv4(),
//             },
//           ],
//         },
//         investmentTracker: {
//           create: {
//             totalProfit: 0,
//             lastProfitUpdate: new Date(),
//           },
//         },
//         transactionHistory: {
//           create: {
//             type: "DEPOSIT",
//             amount: Math.random() * 1000,
//             description: "Initial deposit",
//             userId: userId,
//           },
//         },
//       },
//     });

//     await prisma.investmentStatus.create({
//       data: {
//         status: investmentData.status,
//         investmentId: investment.id,
//       },
//     });
//   }
// };
