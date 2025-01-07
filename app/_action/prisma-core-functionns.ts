// import { prisma } from "@/lib/db/prisma";
// import { Wallets } from "@prisma/client";
// //production intervals
// // const RUN_INTERVAL = 4 * 60 * 60 * 1000;
// // const PROFIT_INTERVAL = 24 * 60 * 60 * 1000;

// //testing intervals
// const RUN_INTERVAL = 1 * 60 * 1000; // 1 minute in milliseconds
// const PROFIT_INTERVAL = 20 * 1000; // 20 seconds in milliseconds

// export async function createUserTracker(userId: string) {
//   const userTracker = await prisma.userTracker.findUnique({
//     where: { userId },
//   });

//   if (!userTracker) {
//     console.log(`Creating userTracker for user ${userId}`);
//     await prisma.userTracker.create({
//       data: {
//         userId,
//         lastProfitUpdate: new Date(0), // Set initial lastProfitUpdate to Unix epoch
//         lastWithdrawal: new Date(),
//       },
//     });
//     console.log(`userTracker created for user ${userId}`);
//   } else {
//     console.log(`userTracker already exists for user ${userId}`);
//   }
// }

// export async function createInvestmentTracker(investmentId: string) {
//   const investmentTracker = await prisma.investmentTracker.findUnique({
//     where: { investmentId },
//   });

//   if (!investmentTracker) {
//     console.log(`Creating investmentTracker for investment ${investmentId}`);
//     await prisma.investmentTracker.create({
//       data: {
//         investmentId,
//         lastProfitUpdate: new Date(0), // Set initial lastProfitUpdate to Unix epoch
//       },
//     });
//     console.log(`investmentTracker created for investment ${investmentId}`);
//   } else {
//     console.log(
//       `investmentTracker already exists for investment ${investmentId}`
//     );
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

//     console.log(`Last run: ${lastRun}`);
//     console.log(`Current time: ${now}`);
//     console.log(`Time difference: ${diffTime} milliseconds`);

//     if (!runUntimed && diffTime < RUN_INTERVAL) {
//       console.log(
//         `Skipping investment processing, last run was less than 4 hours ago`
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

//       const startDate = Math.max(
//         lastProfitUpdate.getTime(),
//         dateToStartIncrease.getTime()
//       );
//       const endDate = now.getTime();
//       const profitCycles = Math.floor((endDate - startDate) / PROFIT_INTERVAL);

//       console.log(`Last profit update: ${lastProfitUpdate}`);
//       console.log(`Date to start increase: ${dateToStartIncrease}`);
//       console.log(`Profit cycles: ${profitCycles}`);

//       if (profitCycles > 0) {
//         const profit = plan.dailyProfit * profitCycles;
//         totalProfit += profit;

//         console.log(`Profit for investment ${investment.id}: ${profit}`);

//         await prisma.investmentTracker.update({
//           where: { id: investmentTracker.id },
//           data: {
//             totalProfit: { increment: profit },
//             lastProfitUpdate: new Date(
//               startDate + profitCycles * PROFIT_INTERVAL
//             ),
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

// export async function processWithdrawal(
//   userId: string,
//   amount: number,
//   walletAddress: string,
//   cryptoType: Wallets
// ) {
//   await prisma.$transaction(async (prisma) => {
//     const userTracker = await prisma.userTracker.findUnique({
//       where: { userId },
//     });

//     if (!userTracker) {
//       throw new Error("User tracker not found");
//     }

//     if (amount > userTracker.balance) {
//       throw new Error("Insufficient balance");
//     }

//     await prisma.userTracker.update({
//       where: { id: userTracker.id },
//       data: {
//         totalWithdrawal: { increment: amount },
//         balance: { decrement: amount },
//         lastWithdrawal: new Date(),
//         user: {
//           update: {
//             withdrawals: {
//               create: {
//                 amount,
//                 cryptoType: cryptoType,
//                 walletAddress: walletAddress,
//                 status: "UNCONFIRMED",
//               },
//             },
//           },
//         },
//       },
//     });
//   });
// }

import { db } from "@/lib/db";
import { eq, and, gte, max } from "drizzle-orm";
import { 
  users, 
  investments, 
  transactionHistory,
  userInvestments,
  userTrackers,
  investmentTrackers,
  investmentPlans,
  withdrawals
} from "@/lib/db/schema";

// Constants remain the same
const RUN_INTERVAL = 1 * 60 * 1000; // 1 minute in milliseconds
const PROFIT_INTERVAL = 20 * 1000; // 20 seconds in milliseconds

export async function createUserTracker(userId: string) {
  const userTracker = await db.select()
    .from(userTrackers)
    .where(eq(userTrackers.userId, userId))
    .limit(1);

  if (!userTracker.length) {
    console.log(`Creating userTracker for user ${userId}`);
    await db.insert(userTrackers).values({
      userId,
      lastProfitUpdate: new Date(0),
      lastWithdrawal: new Date(),
    });
    console.log(`userTracker created for user ${userId}`);
  } else {
    console.log(`userTracker already exists for user ${userId}`);
  }
}

export async function createInvestmentTracker(investmentId: string) {
  const investmentTracker = await db.select()
    .from(investmentTrackers)
    .where(eq(investmentTrackers.investmentId, investmentId))
    .limit(1);

  if (!investmentTracker.length) {
    console.log(`Creating investmentTracker for investment ${investmentId}`);
    await db.insert(investmentTrackers).values({
      investmentId,
      lastProfitUpdate: new Date(0),
    });
    console.log(`investmentTracker created for investment ${investmentId}`);
  } else {
    console.log(`investmentTracker already exists for investment ${investmentId}`);
  }
}

export async function processInvestments(userId: string, runUntimed: boolean = false) {
  return db.transaction(async (tx) => {
    console.log(`Processing investments for user ${userId}`);

    const userTracker = await tx.query.userTrackers.findFirst({
      where: eq(userTrackers.userId, userId),
      with: {
        user: {
          with: {
            investments: {
              with: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (!userTracker) {
      console.log(`userTracker not found for user ${userId}, creating...`);
      await createUserTracker(userId);
      console.log(`userTracker created for user ${userId}`);
      return {
        balance: 0,
        totalProfit: 0,
        totalWithdrawal: 0,
      };
    }

    const now = new Date();
    const lastRun = userTracker.lastProfitUpdate;
    const diffTime = Math.abs(now.getTime() - lastRun.getTime());

    console.log(`Last run: ${lastRun}`);
    console.log(`Current time: ${now}`);
    console.log(`Time difference: ${diffTime} milliseconds`);

    if (!runUntimed && diffTime < RUN_INTERVAL) {
      console.log(`Skipping investment processing, last run was less than 4 hours ago`);
      return {
        balance: userTracker.balance,
        totalProfit: userTracker.totalProfit,
        totalWithdrawal: userTracker.totalWithdrawal,
      };
    }

    let totalProfit = 0;

    for (const investment of userTracker.user.investments) {
      console.log(`Processing investment ${investment.id}`);

      if (!investment.startIncrease || !investment.status || investment.status.status !== "CONFIRMED") {
        console.log(`Skipping investment ${investment.id}, not confirmed or startIncrease is false`);
        continue;
      }

      const investmentTracker = await tx.query.investmentTrackers.findFirst({
        where: eq(investmentTrackers.investmentId, investment.id),
      });

      if (!investmentTracker) {
        console.log(`investmentTracker not found for investment ${investment.id}, creating...`);
        await createInvestmentTracker(investment.id);
        console.log(`investmentTracker created for investment ${investment.id}`);
        continue;
      }

      const plan = await tx.query.investmentPlans.findFirst({
        where: eq(investmentPlans.id, investment.planId),
      });

      if (!plan) {
        console.log(`Investment plan not found for investment ${investment.id}`);
        continue;
      }

      const lastProfitUpdate = investmentTracker.lastProfitUpdate;
      const dateToStartIncrease = investment.dateToStartIncrease;

      if (!dateToStartIncrease || dateToStartIncrease > now) {
        console.log(`Skipping investment ${investment.id}, dateToStartIncrease is in the future`);
        continue;
      }

      const startDate = Math.max(lastProfitUpdate.getTime(), dateToStartIncrease.getTime());
      const endDate = now.getTime();
      const profitCycles = Math.floor((endDate - startDate) / PROFIT_INTERVAL);

      console.log(`Last profit update: ${lastProfitUpdate}`);
      console.log(`Date to start increase: ${dateToStartIncrease}`);
      console.log(`Profit cycles: ${profitCycles}`);

      if (profitCycles > 0) {
        const profit = plan.dailyProfit * profitCycles;
        totalProfit += profit;

        console.log(`Profit for investment ${investment.id}: ${profit}`);

        await tx.update(investmentTrackers)
          .set({
            totalProfit: investmentTracker.totalProfit + profit,
            lastProfitUpdate: new Date(startDate + profitCycles * PROFIT_INTERVAL),
          })
          .where(eq(investmentTrackers.id, investmentTracker.id));

        await tx.insert(transactionHistory).values({
          type: "NEUTRAL",
          amount: profit,
          description: `Profit for investment ${investment.id}`,
          userId: userTracker.userId,
          investmentId: investment.id,
        });
      } else {
        console.log(`No profit cycles for investment ${investment.id}`);
      }
    }

    console.log(`Total profit: ${totalProfit}`);

    const updatedUserTracker = await tx.update(userTrackers)
      .set({
        totalProfit: userTracker.totalProfit + totalProfit,
        balance: userTracker.balance + totalProfit,
        lastProfitUpdate: now,
      })
      .where(eq(userTrackers.id, userTracker.id))
      .returning();

    await tx.insert(transactionHistory).values({
      type: "NEUTRAL",
      amount: totalProfit,
      description: "Total profit",
      userId: userTracker.userId,
    });

    console.log(`Updated user tracker: ${JSON.stringify(updatedUserTracker[0])}`);

    return {
      balance: updatedUserTracker[0].balance,
      totalProfit: updatedUserTracker[0].totalProfit,
      totalWithdrawal: updatedUserTracker[0].totalWithdrawal,
    };
  });
}

export async function processWithdrawal(userId: string, amount: number, walletAddress: string, cryptoType: string) {
  await db.transaction(async (tx) => {
    const userTracker = await tx.query.userTrackers.findFirst({
      where: eq(userTrackers.userId, userId),
    });

    if (!userTracker) {
      throw new Error("User tracker not found");
    }

    if (amount > userTracker.balance) {
      throw new Error("Insufficient balance");
    }

    await tx.update(userTrackers)
      .set({
        totalWithdrawal: userTracker.totalWithdrawal + amount,
        balance: userTracker.balance - amount,
        lastWithdrawal: new Date(),
      })
      .where(eq(userTrackers.id, userTracker.id));

    await tx.insert(withdrawals).values({
      amount,
      cryptoType,
      walletAddress,
      status: "UNCONFIRMED",
      userId: userId,
    });
  });
}

