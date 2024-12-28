// import { supabaseBrowser } from "@/lib/supabaseClient";
// import { Wallets } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error(
//     "Supabase URL and Anon Key must be set in environment variables."
//   );
// }

// function generateUuid(): string {
//   return uuidv4();
// }

// const supabase = supabaseBrowser();
// const REFERRAL_BONUS = 300;
// const PROFIT_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
// const WITHDRAWAL_ELIGIBILITY_DAYS = 30;

// export async function createUserTracker(userId: string) {
//   try {
//     const { data: userTracker, error } = await supabase
//       .from("UserTracker")
//       .select("*")
//       .eq("userId", userId)
//       .single();

//     if (error && error.code !== "PGRST116") {
//       console.error("Error fetching user tracker:", error);
//     }

//     if (!userTracker) {
//       console.log(`Creating userTracker for user ${userId}`);
//       const { error: insertError } = await supabase.from("UserTracker").insert({
//         id: generateUuid(),
//         userId,
//         lastProfitUpdate: new Date(0).toISOString(),
//         lastWithdrawal: new Date().toISOString(),
//         userBalance: 0,
//         withdrawableBalance: 0,
//       });

//       if (insertError) {
//         console.error("Error creating user tracker:", insertError);
//       } else {
//         console.log(`userTracker created for user ${userId}`);
//       }
//     } else {
//       console.log(`userTracker already exists for user ${userId}`);
//     }
//   } catch (error) {
//     console.error("An unexpected error occurred in createUserTracker:", error);
//   }
// }

// export async function processInvestments(
//   userId: string,
//   runUntimed: boolean = false
// ) {
//   const { data: userTracker, error: userTrackerError } = await supabase
//     .from("UserTracker")
//     .select(
//       `
//       *,
//       user:User(
//         investments:Investment(
//           *,
//           status:InvestmentStatus(*)
//         ),
//         referredUsers:User!referredById(
//           investments:Investment(*)
//         )
//       )
//     `
//     )
//     .eq("userId", userId)
//     .single();

//   if (userTrackerError) {
//     console.error("Error fetching user tracker:", userTrackerError);
//     return {
//       userBalance: 0,
//       withdrawableBalance: 0,
//       totalProfit: 0,
//       totalWithdrawal: 0,
//     };
//   }

//   if (!userTracker) {
//     console.log(`userTracker not found for user ${userId}, creating...`);
//     await createUserTracker(userId);
//     console.log(`userTracker created for user ${userId}`);
//     return {
//       userBalance: 0,
//       withdrawableBalance: 0,
//       totalProfit: 0,
//       totalWithdrawal: 0,
//     };
//   }

//   const now = new Date().toISOString();
//   const lastRun = userTracker.lastProfitUpdate;
//   const diffTime = new Date(now).getTime() - new Date(lastRun).getTime();

//   console.log(`Last run: ${lastRun}`);
//   console.log(`Current time: ${now}`);
//   console.log(`Time difference: ${diffTime} milliseconds`);

//   let totalProfit = 0;
//   let totalWithdrawableProfit = 0;
//   if (userTracker.user) {
//     for (const investment of userTracker.user.investments) {
//       console.log(`Processing investment ${investment.id}`);

//       if (
//         !investment.startIncrease ||
//         !investment.status ||
//         investment.status[0].status !== "CONFIRMED"
//       ) {
//         console.log(
//           `Skipping investment ${investment.id}, not confirmed or startIncrease is false`
//         );
//         continue;
//       }

//       const { data: plan, error: planError } = await supabase
//         .from("InvestmentPlan")
//         .select("*")
//         .eq("id", investment.planId)
//         .single();

//       if (planError) {
//         console.error("Error fetching investment plan:", planError);
//         continue;
//       }

//       if (!plan) {
//         console.log(
//           `Investment plan not found for investment ${investment.id}`
//         );
//         continue;
//       }

//       const dateToStartIncrease = investment.dateToStartIncrease;

//       if (
//         !dateToStartIncrease ||
//         new Date(dateToStartIncrease) > new Date(now)
//       ) {
//         console.log(
//           `Skipping investment ${investment.id}, dateToStartIncrease is in the future`
//         );
//         continue;
//       }

//       const startDate = new Date(dateToStartIncrease).getTime();
//       const endDate = new Date(now).getTime();
//       const profitCycles =
//         Math.floor((endDate - startDate) / PROFIT_INTERVAL) + 1;

//       console.log(`Date to start increase: ${dateToStartIncrease}`);
//       console.log(`Profit cycles: ${profitCycles}`);

//       if (profitCycles > 0) {
//         const profit = plan.dailyProfit * profitCycles;
//         totalProfit += profit;

//         if (
//           endDate - startDate >=
//           WITHDRAWAL_ELIGIBILITY_DAYS * PROFIT_INTERVAL
//         ) {
//           totalWithdrawableProfit += profit;
//         }

//         console.log(`Profit for investment ${investment.id}: ${profit}`);
//       } else {
//         console.log(`No profit cycles for investment ${investment.id}`);
//       }
//     }
//   } else {
//     console.log("usertracker is null");
//   }

//   console.log(`Total profit: ${totalProfit}`);
//   let referralBonus = 0;
//   if (userTracker.user && userTracker.user.referredUsers) {
//     for (const referredUser of userTracker.user.referredUsers) {
//       if (referredUser.investments && referredUser.investments.length > 0) {
//         referralBonus += REFERRAL_BONUS;
//       }
//     }
//   }

//   console.log(`Referral bonus: ${referralBonus}`);
//   const newUserBalance =
//     totalProfit + referralBonus - userTracker.totalWithdrawal;
//   const newWithdrawableBalance =
//     totalWithdrawableProfit + referralBonus - userTracker.totalWithdrawal;

//   console.log(`New user balance: ${newUserBalance}`);
//   console.log(`New withdrawable balance: ${newWithdrawableBalance}`);

//   // Update the user tracker with the new balances and referral bonus
//   const { error: updateError } = await supabase
//     .from("UserTracker")
//     .update({
//       totalProfit: totalProfit,
//       balance: newUserBalance,
//       withdrawableBalance: newWithdrawableBalance,
//       lastProfitUpdate: new Date().toISOString(),
//     })
//     .eq("id", userTracker.id);

//   if (updateError) {
//     console.error("Error updating user tracker:", updateError);
//     return {
//       userBalance: userTracker.balance,
//       withdrawableBalance: userTracker.withdrawableBalance,
//       totalProfit: userTracker.totalProfit,
//       totalWithdrawal: userTracker.totalWithdrawal,
//     };
//   }

//   const { data: updatedUserTracker, error: fetchError } = await supabase
//     .from("UserTracker")
//     .select("*")
//     .eq("id", userTracker.id)
//     .single();

//   if (fetchError) {
//     console.error("Error fetching updated user tracker:", fetchError);
//     return {
//       userBalance: userTracker.balance,
//       withdrawableBalance: userTracker.withdrawableBalance,
//       totalProfit: userTracker.totalProfit,
//       totalWithdrawal: userTracker.totalWithdrawal,
//     };
//   }

//   const { error: transactionError } = await supabase
//     .from("TransactionHistory")
//     .insert({
//       id: generateUuid(),
//       type: "NEUTRAL",
//       amount: totalProfit,
//       description: "Total profit",
//       userId: userTracker.userId,
//       updatedAt: now,
//     });

//   if (transactionError) {
//     console.error("Error creating transaction history:", transactionError);
//   }

//   console.log(`Updated user tracker: ${JSON.stringify(updatedUserTracker)}`);

//   return {
//     userBalance: updatedUserTracker.balance,
//     withdrawableBalance: updatedUserTracker.withdrawableBalance,
//     totalProfit: updatedUserTracker.totalProfit,
//     totalWithdrawal: updatedUserTracker.totalWithdrawal,
//   };
// }

// export async function processWithdrawal(
//   userId: string,
//   amount: number,
//   walletAddress: string,
//   cryptoType: Wallets
// ) {
//   const { data: userTracker, error: userTrackerError } = await supabase
//     .from("UserTracker")
//     .select("*")
//     .eq("userId", userId)
//     .single();

//   if (userTrackerError) {
//     console.error("Error fetching user tracker:", userTrackerError);
//     throw new Error("User tracker not found");
//   }

//   if (amount > userTracker.withdrawableBalance) {
//     throw new Error("Insufficient withdrawable balance");
//   }

//   const now = new Date().toISOString();

//   const { error: updateError } = await supabase
//     .from("UserTracker")
//     .update({
//       totalWithdrawal: userTracker.totalWithdrawal + amount,
//       userBalance: userTracker.balance - amount,
//       withdrawableBalance: userTracker.withdrawableBalance - amount,
//       lastWithdrawal: now,
//     })
//     .eq("id", userTracker.id);

//   if (updateError) {
//     console.error("Error updating user tracker:", updateError);
//     throw new Error("Failed to update user tracker");
//   }

//   const { error: transactionError } = await supabase
//     .from("TransactionHistory")
//     .insert({
//       id: generateUuid(),
//       type: "WITHDRAWAL",
//       amount: amount,
//       description: "User withdrawal",
//       userId: userTracker.userId,
//       walletAddress: walletAddress,
//       cryptoType: cryptoType,
//       updatedAt: now,
//     });

//   if (transactionError) {
//     console.error("Error creating transaction history:", transactionError);
//     throw new Error("Failed to create transaction history");
//   }

//   const { data: updatedUserTracker, error: fetchError } = await supabase
//     .from("UserTracker")
//     .select("*")
//     .eq("id", userTracker.id)
//     .single();

//   if (fetchError) {
//     console.error("Error fetching updated user tracker:", fetchError);
//     throw new Error("Failed to fetch updated user tracker");
//   }

//   console.log(
//     `Updated user tracker after withdrawal: ${JSON.stringify(
//       updatedUserTracker
//     )}`
//   );

//   return {
//     userBalance: updatedUserTracker.balance,
//     withdrawableBalance: updatedUserTracker.withdrawableBalance,
//     totalProfit: updatedUserTracker.totalProfit,
//     totalWithdrawal: updatedUserTracker.totalWithdrawal,
//   };
// }

import { supabaseBrowser } from "@/lib/supabaseClient";
import { Wallets } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and Anon Key must be set in environment variables."
  );
}

function generateUuid(): string {
  return uuidv4();
}

const supabase = supabaseBrowser();
const REFERRAL_BONUS = 300;
const PROFIT_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const WITHDRAWAL_ELIGIBILITY_DAYS = 30;

export async function createUserTracker(userId: string) {
  try {
    const { data: userTracker, error } = await supabase
      .from("UserTracker")
      .select("*")
      .eq("userId", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user tracker:", error);
    }

    if (!userTracker) {
      console.log(`Creating userTracker for user ${userId}`);
      const { error: insertError } = await supabase.from("UserTracker").insert({
        id: generateUuid(),
        userId,
        lastProfitUpdate: new Date(0).toISOString(),
        lastWithdrawal: new Date().toISOString(),
        userBalance: 0,
        withdrawableBalance: 0,
      });

      if (insertError) {
        console.error("Error creating user tracker:", insertError);
      } else {
        console.log(`userTracker created for user ${userId}`);
      }
    } else {
      console.log(`userTracker already exists for user ${userId}`);
    }
  } catch (error) {
    console.error("An unexpected error occurred in createUserTracker:", error);
  }
}

export async function processInvestments(
  userId: string,
  runUntimed: boolean = false
) {
  const { data: userTracker, error: userTrackerError } = await supabase
    .from("UserTracker")
    .select(
      `
      *,
      user:User(
        investments:Investment(
          *,
          status:InvestmentStatus(*)
        ),
        referredUsers:User!referredById(
          investments:Investment(*)
        )
      )
    `
    )
    .eq("userId", userId)
    .single();

  if (userTrackerError) {
    console.error("Error fetching user tracker:", userTrackerError);
    return {
      userBalance: 0,
      withdrawableBalance: 0,
      totalProfit: 0,
      totalWithdrawal: 0,
      profitLast24Hours: 0,
    };
  }

  if (!userTracker) {
    console.log(`userTracker not found for user ${userId}, creating...`);
    await createUserTracker(userId);
    console.log(`userTracker created for user ${userId}`);
    return {
      userBalance: 0,
      withdrawableBalance: 0,
      totalProfit: 0,
      totalWithdrawal: 0,
      profitLast24Hours: 0,
    };
  }

  const now = new Date().toISOString();
  const lastRun = userTracker.lastProfitUpdate;
  const diffTime = new Date(now).getTime() - new Date(lastRun).getTime();

  console.log(`Last run: ${lastRun}`);
  console.log(`Current time: ${now}`);
  console.log(`Time difference: ${diffTime} milliseconds`);

  let totalProfit = 0;
  let totalWithdrawableProfit = 0;
  let profitLast24Hours = 0;

  const twentyFourHoursAgo = new Date(now).getTime() - PROFIT_INTERVAL;

  if (userTracker.user) {
    for (const investment of userTracker.user.investments) {
      console.log(`Processing investment ${investment.id}`);

      if (
        !investment.startIncrease ||
        !investment.status ||
        investment.status[0].status !== "CONFIRMED"
      ) {
        console.log(
          `Skipping investment ${investment.id}, not confirmed or startIncrease is false`
        );
        continue;
      }

      const { data: plan, error: planError } = await supabase
        .from("InvestmentPlan")
        .select("*")
        .eq("id", investment.planId)
        .single();

      if (planError) {
        console.error("Error fetching investment plan:", planError);
        continue;
      }

      if (!plan) {
        console.log(
          `Investment plan not found for investment ${investment.id}`
        );
        continue;
      }

      const dateToStartIncrease = investment.dateToStartIncrease;

      if (
        !dateToStartIncrease ||
        new Date(dateToStartIncrease) > new Date(now)
      ) {
        console.log(
          `Skipping investment ${investment.id}, dateToStartIncrease is in the future`
        );
        continue;
      }

      const startDate = new Date(dateToStartIncrease).getTime();
      const endDate = new Date(now).getTime();
      const profitCycles =
        Math.floor((endDate - startDate) / PROFIT_INTERVAL) + 1;

      console.log(`Date to start increase: ${dateToStartIncrease}`);
      console.log(`Profit cycles: ${profitCycles}`);

      if (profitCycles > 0) {
        const profit = plan.dailyProfit * profitCycles;
        totalProfit += profit;

        if (startDate >= twentyFourHoursAgo) {
          profitLast24Hours += profit;
        }

        if (
          endDate - startDate >=
          WITHDRAWAL_ELIGIBILITY_DAYS * PROFIT_INTERVAL
        ) {
          totalWithdrawableProfit += profit;
        }

        console.log(`Profit for investment ${investment.id}: ${profit}`);
      } else {
        console.log(`No profit cycles for investment ${investment.id}`);
      }
    }
  } else {
    console.log("usertracker is null");
  }

  console.log(`Total profit: ${totalProfit}`);
  let referralBonus = 0;
  if (userTracker.user && userTracker.user.referredUsers) {
    for (const referredUser of userTracker.user.referredUsers) {
      if (referredUser.investments && referredUser.investments.length > 0) {
        referralBonus += REFERRAL_BONUS;
      }
    }
  }

  console.log(`Referral bonus: ${referralBonus}`);
  const newUserBalance =
    totalProfit + referralBonus - userTracker.totalWithdrawal;
  const newWithdrawableBalance =
    totalWithdrawableProfit + referralBonus - userTracker.totalWithdrawal;

  console.log(`New user balance: ${newUserBalance}`);
  console.log(`New withdrawable balance: ${newWithdrawableBalance}`);

  // Update the user tracker with the new balances and referral bonus
  const { error: updateError } = await supabase
    .from("UserTracker")
    .update({
      totalProfit: totalProfit,
      balance: newUserBalance,
      withdrawableBalance: newWithdrawableBalance,
      lastProfitUpdate: new Date().toISOString(),
    })
    .eq("id", userTracker.id);

  if (updateError) {
    console.error("Error updating user tracker:", updateError);
    return {
      userBalance: userTracker.balance,
      withdrawableBalance: userTracker.withdrawableBalance,
      totalProfit: userTracker.totalProfit,
      totalWithdrawal: userTracker.totalWithdrawal,
      profitLast24Hours: 0,
    };
  }

  const { data: updatedUserTracker, error: fetchError } = await supabase
    .from("UserTracker")
    .select("*")
    .eq("id", userTracker.id)
    .single();

  if (fetchError) {
    console.error("Error fetching updated user tracker:", fetchError);
    return {
      userBalance: userTracker.balance,
      withdrawableBalance: userTracker.withdrawableBalance,
      totalProfit: userTracker.totalProfit,
      totalWithdrawal: userTracker.totalWithdrawal,
      profitLast24Hours: 0,
    };
  }

  const { error: transactionError } = await supabase
    .from("TransactionHistory")
    .insert({
      id: generateUuid(),
      type: "NEUTRAL",
      amount: totalProfit,
      description: "Total profit",
      userId: userTracker.userId,
      updatedAt: now,
    });

  if (transactionError) {
    console.error("Error creating transaction history:", transactionError);
  }

  console.log(`Updated user tracker: ${JSON.stringify(updatedUserTracker)}`);

  return {
    userBalance: updatedUserTracker.balance,
    withdrawableBalance: updatedUserTracker.withdrawableBalance,
    totalProfit: updatedUserTracker.totalProfit,
    totalWithdrawal: updatedUserTracker.totalWithdrawal,
    profitLast24Hours: profitLast24Hours,
  };
}

export async function processWithdrawal(
  userId: string,
  amount: number,
  walletAddress: string,
  cryptoType: Wallets
) {
  const { data: userTracker, error: userTrackerError } = await supabase
    .from("UserTracker")
    .select("*")
    .eq("userId", userId)
    .single();

  if (userTrackerError) {
    console.error("Error fetching user tracker:", userTrackerError);
    throw new Error("Failed to fetch user tracker");
  }

  if (!userTracker) {
    console.log(`userTracker not found for user ${userId}`);
    throw new Error("User tracker not found");
  }

  const lastWithdrawalDate = new Date(userTracker.lastWithdrawal);
  const currentDate = new Date();
  const daysSinceLastWithdrawal = Math.floor(
    (currentDate.getTime() - lastWithdrawalDate.getTime()) /
      (24 * 60 * 60 * 1000)
  );

  if (daysSinceLastWithdrawal < WITHDRAWAL_ELIGIBILITY_DAYS) {
    throw new Error(
      `Withdrawals are only allowed once every ${WITHDRAWAL_ELIGIBILITY_DAYS} days.`
    );
  }

  if (amount > userTracker.withdrawableBalance) {
    throw new Error("Requested amount exceeds withdrawable balance.");
  }

  // Deduct the amount from the withdrawable balance
  const newWithdrawableBalance = userTracker.withdrawableBalance - amount;

  // Update user tracker with new balance and withdrawal date
  const { error: updateError } = await supabase
    .from("UserTracker")
    .update({
      withdrawableBalance: newWithdrawableBalance,
      lastWithdrawal: currentDate.toISOString(),
      totalWithdrawal: userTracker.totalWithdrawal + amount,
    })
    .eq("id", userTracker.id);

  if (updateError) {
    console.error("Error updating user tracker:", updateError);
    throw new Error("Failed to update user tracker after withdrawal");
  }

  // Add the transaction to the transaction history
  const { error: transactionError } = await supabase
    .from("TransactionHistory")
    .insert({
      id: generateUuid(),
      type: "WITHDRAWAL",
      amount: amount,
      description: "Withdrawal",
      userId: userTracker.userId,
      updatedAt: currentDate.toISOString(),
      walletAddress: walletAddress,
      cryptoType: cryptoType,
    });

  if (transactionError) {
    console.error("Error creating transaction history:", transactionError);
    throw new Error("Failed to create transaction history");
  }

  return {
    withdrawableBalance: newWithdrawableBalance,
  };
}
