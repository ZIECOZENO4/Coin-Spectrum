// // Import statements
// import { InvestmentPlanName } from "@prisma/client";
// import { prisma } from "@/lib/db/prisma";

// // Investment plans data
// const investmentPlans = [
//   {
//     name: "VIP1",
//     price: 1000,
//     profitPercent: 10,
//     rating: 1,
//     principalReturn: true,
//     principalWithdraw: false,
//     creditAmount: 300000,
//     depositFee: "0.00% + $0.00 (min. $0.00 max. $0.00)",
//     debitAmount: 300000,
//   },
//   {
//     name: "VIP2",
//     price: 2000,
//     profitPercent: 20,
//     rating: 2,
//     principalReturn: true,
//     principalWithdraw: false,
//     creditAmount: 300000,
//     depositFee: "0.00% + $0.00 (min. $0.00 max. $0.00)",
//     debitAmount: 300000,
//   },
//   {
//     name: "VIP3",
//     price: 3000,
//     profitPercent: 30,
//     rating: 3,
//     principalReturn: true,
//     principalWithdraw: false,
//     creditAmount: 300000,
//     depositFee: "0.00% + $0.00 (min. $0.00 max. $0.00)",
//     debitAmount: 300000,
//   },
//   {
//     name: "VIP4",
//     price: 4000,
//     profitPercent: 40,
//     rating: 4,
//     principalReturn: true,
//     principalWithdraw: false,
//     creditAmount: 300000,
//     depositFee: "0.00% + $0.00 (min. $0.00 max. $0.00)",
//     debitAmount: 300000,
//   },
//   {
//     name: "VIP5",
//     price: 5000,
//     profitPercent: 50,
//     rating: 5,
//     principalReturn: true,
//     principalWithdraw: false,
//     creditAmount: 300000,
//     depositFee: "0.00% + $0.00 (min. $0.00 max. $0.00)",
//     debitAmount: 300000,
//   },
//   {
//     name: "VIP6",
//     price: 6000,
//     profitPercent: 60,
//     rating: 6,
//     principalReturn: true,
//     principalWithdraw: false,
//     creditAmount: 300000,
//     depositFee: "0.00% + $0.00 (min. $0.00 max. $0.00)",
//     debitAmount: 300000,
//   },
//   {
//     name: "VIP7",
//     price: 7000,
//     profitPercent: 70,
//     rating: 7,
//     principalReturn: true,
//     principalWithdraw: false,
//     creditAmount: 300000,
//     depositFee: "0.00% + $0.00 (min. $0.00 max. $0.00)",
//     debitAmount: 300000,
//   },
// ];

// // Function to create investment plans
// export const createInvestmentPlans = async () => {
//   for (const plan of investmentPlans) {
//     // Calculate periodic and daily profit
//     const periodicProfit = (plan.price * plan.profitPercent) / 100;
//     const durationDays = 30; // Assuming duration of 30 days
//     const dailyProfit = periodicProfit / durationDays;

//     await prisma.investmentPlan.upsert({
//       where: { name: plan.name as InvestmentPlanName },
//       update: {
//         price: plan.price,
//         profitPercent: plan.profitPercent,
//         rating: plan.rating,
//         principalReturn: plan.principalReturn,
//         principalWithdraw: plan.principalWithdraw,
//         creditAmount: plan.creditAmount,
//         depositFee: plan.depositFee,
//         debitAmount: plan.debitAmount,
//         periodicProfit: periodicProfit,
//         dailyProfit: dailyProfit,
//         totalProfit: periodicProfit * plan.rating, // Assuming totalProfit is related to price and rating
//         duration: durationDays,
//         durationDays: durationDays,
//       },
//       create: {
//         name: plan.name as InvestmentPlanName,
//         price: plan.price,
//         profitPercent: plan.profitPercent,
//         rating: plan.rating,
//         principalReturn: plan.principalReturn,
//         principalWithdraw: plan.principalWithdraw,
//         creditAmount: plan.creditAmount,
//         depositFee: plan.depositFee,
//         debitAmount: plan.debitAmount,
//         periodicProfit: periodicProfit,
//         dailyProfit: dailyProfit,
//         totalProfit: periodicProfit * plan.rating, // Assuming totalProfit is related to price and rating
//         duration: durationDays,
//         durationDays: durationDays,
//       },
//     });
//   }
// };
