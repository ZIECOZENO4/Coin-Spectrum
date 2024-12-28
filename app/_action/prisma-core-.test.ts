// import { prisma } from "@/lib/db/prisma";

// // Actual time values:
// // - Run the function once every 4 hours (14400 seconds)
// // - Increase profit once every 24 hours (86400 seconds)

// export async function createUserTracker(userId: string) {
//   const userTracker = await prisma.userTracker.findUnique({
//     where: { userId },
//   });

//   if (!userTracker) {
//     await prisma.userTracker.create({
//       data: {
//         userId,
//         lastProfitUpdate: new Date(),
//         lastWithdrawal: new Date(),
//       },
//     });
//   }
// }

// export async function createInvestmentTracker(investmentId: string) {
//   const investmentTracker = await prisma.investmentTracker.findUnique({
//     where: { investmentId },
//   });

//   if (!investmentTracker) {
//     await prisma.investmentTracker.create({
//       data: {
//         investmentId,
//         lastProfitUpdate: new Date(),
//       },
//     });
//   }
// }

// export async function processInvestments(
//   userId: string,
//   runUntimed: boolean = false
// ) {
//   return prisma.$transaction(async (prisma) => {
//     console.log(`Processing investments for user ${userId}`);

//     const userTracker = await prisma.userTracker.findUnique({
//       where: { userId },
//       include: {
//         user: {
//           include: {
//             investments: {
//               include: {
//                 status: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!userTracker) {
//       console.log(`userTracker not found for user ${userId}, creating...`);
//       await createUserTracker(userId);
//       console.log(`userTracker created for user ${userId}`);
//       return {
//         balance: 0,
//         totalProfit: 0,
//         totalWithdrawal: 0,
//       };
//     }

//     const now = new Date();
//     const lastRun = userTracker.lastProfitUpdate;
//     const diffTime = Math.abs(now.getTime() - lastRun.getTime());
//     const diffSeconds = Math.floor(diffTime / 1000);

//     console.log(`Last run: ${lastRun}`);
//     console.log(`Current time: ${now}`);
//     console.log(`Time difference: ${diffSeconds} seconds`);

//     // Run the function once every 3 minutes  (for testing) if runUntimed is false
//     if (!runUntimed && diffSeconds < 20 * 3 * 3) {
//       console.log(
//         `Skipping investment processing, last run was less than 20 seconds ago`
//       );
//       return {
//         balance: userTracker.balance,
//         totalProfit: userTracker.totalProfit,
//         totalWithdrawal: userTracker.totalWithdrawal,
//       };
//     }

//     let totalProfit = 0;

//     for (const investment of userTracker.user.investments) {
//       console.log(`Processing investment ${investment.id}`);

//       if (
//         !investment.startIncrease ||
//         !investment.status ||
//         investment.status.status !== "CONFIRMED"
//       ) {
//         console.log(
//           `Skipping investment ${investment.id}, not confirmed or startIncrease is false`
//         );
//         continue;
//       }

//       const investmentTracker = await prisma.investmentTracker.findUnique({
//         where: { investmentId: investment.id },
//       });

//       if (!investmentTracker) {
//         console.log(
//           `investmentTracker not found for investment ${investment.id}, creating...`
//         );
//         await createInvestmentTracker(investment.id);
//         console.log(
//           `investmentTracker created for investment ${investment.id}`
//         );
//         continue;
//       }

//       const plan = await prisma.investmentPlan.findUnique({
//         where: { id: investment.planId },
//       });

//       if (!plan) {
//         console.log(
//           `Investment plan not found for investment ${investment.id}`
//         );
//         continue;
//       }

//       const lastProfitUpdate = investmentTracker.lastProfitUpdate;
//       const dateToStartIncrease = investment.dateToStartIncrease;

//       if (!dateToStartIncrease || dateToStartIncrease > now) {
//         console.log(
//           `Skipping investment ${investment.id}, dateToStartIncrease is in the future`
//         );
//         continue;
//       }

//       const diffTime = Math.abs(
//         now.getTime() -
//           Math.max(lastProfitUpdate.getTime(), dateToStartIncrease.getTime())
//       );
//       const diffMinutes = Math.ceil(diffTime / (1000 * 60));

//       console.log(`Last profit update: ${lastProfitUpdate}`);
//       console.log(`Date to start increase: ${dateToStartIncrease}`);
//       console.log(`Time difference: ${diffMinutes} minutes`);

//       // Increase profit once every 2 minutes (for testing)
//       const profitCycles = Math.floor(diffMinutes / 2);

//       if (profitCycles > 0) {
//         const profit = plan.dailyProfit * profitCycles;
//         totalProfit += profit;

//         console.log(`Profit cycles: ${profitCycles}`);
//         console.log(`Profit for investment ${investment.id}: ${profit}`);

//         await prisma.investmentTracker.update({
//           where: { id: investmentTracker.id },
//           data: {
//             totalProfit: { increment: profit },
//             lastProfitUpdate: now,
//           },
//         });

//         await prisma.transactionHistory.create({
//           data: {
//             type: "NEUTRAL",
//             amount: profit,
//             description: `Profit for investment ${investment.id}`,
//             userId: userTracker.userId,
//             investmentId: investment.id,
//           },
//         });
//       } else {
//         console.log(`No profit cycles for investment ${investment.id}`);
//       }
//     }

//     console.log(`Total profit: ${totalProfit}`);

//     const updatedUserTracker = await prisma.userTracker.update({
//       where: { id: userTracker.id },
//       data: {
//         totalProfit: { increment: totalProfit },
//         balance: userTracker.balance + totalProfit,
//         lastProfitUpdate: now,
//       },
//     });

//     await prisma.transactionHistory.create({
//       data: {
//         type: "NEUTRAL",
//         amount: totalProfit,
//         description: "Total profit",
//         userId: userTracker.userId,
//       },
//     });

//     console.log(`Updated user tracker: ${JSON.stringify(updatedUserTracker)}`);

//     return {
//       balance: updatedUserTracker.balance,
//       totalProfit: updatedUserTracker.totalProfit,
//       totalWithdrawal: updatedUserTracker.totalWithdrawal,
//     };
//   });
// }

// // export async function processWithdrawal(userId: string, amount: number) {
// //   await prisma.$transaction(async (prisma) => {
// //     const userTracker = await prisma.userTracker.findUnique({
// //       where: { userId },
// //     });

// //     if (!userTracker) {
// //       throw new Error("User tracker not found");
// //     }

// //     if (amount > userTracker.balance || amount < 1000) {
// //       throw new Error("Insufficient balance");
// //     }

// //     await prisma.userTracker.update({
// //       where: { id: userTracker.id },
// //       data: {
// //         totalWithdrawal: { increment: amount },
// //         balance: { decrement: amount },
// //         lastWithdrawal: new Date(),
// //       },
// //     });

// //     await prisma.withdrawal.create({
// //       data: {
// //         userId,
// //         amount,
// //         status: "UNCONFIRMED",
// //       },
// //     });
// //   });
// // }

// export async function processWithdrawal(
//   userId: string,
//   amount: number,
//   accountNumber: number,
//   accountName: string,
//   bankName: string
// ) {
//   await prisma.$transaction(async (prisma) => {
//     const userTracker = await prisma.userTracker.findUnique({
//       where: { userId },
//     });

//     if (!userTracker) {
//       throw new Error("User tracker not found");
//     }

//     if (amount > userTracker.balance || amount < 1000) {
//       throw new Error("Insufficient balance");
//     }

//     await prisma.userTracker.update({
//       where: { id: userTracker.id },
//       data: {
//         totalWithdrawal: { increment: amount },
//         balance: { decrement: amount },
//         lastWithdrawal: new Date(),
//       },
//     });

//     await prisma.withdrawal.create({
//       data: {
//         userId,
//         amount,
//         status: "UNCONFIRMED",
//         accountNumber: String(accountNumber),
//         accountName,
//         bankName,
//       },
//     });

//     await prisma.user.update({
//       where: { id: userId },
//       data: {
//         accountNumber: String(accountNumber),
//         accountName,
//         bankName,
//       },
//     });
//   });
// }
