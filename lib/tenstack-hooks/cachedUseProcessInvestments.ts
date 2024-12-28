// import { useSuspenseQuery } from "@tanstack/react-query";
// import { processInvestments } from "@/app/_action/supabase-core-clients";
// import { formatDistanceToNow } from "date-fns";
// import { useCachedDataStore } from "../zuustand-store";

// const fetchProcessInvestments = async ({
//   queryKey,
// }: {
//   queryKey: [string, string, boolean | undefined];
// }) => {
//   const [, userId, runUntimed] = queryKey;
//   console.log("fetchProcessInvestments called with:", { userId, runUntimed });

//   try {
//     const result = await processInvestments(userId, runUntimed);
//     console.log("processInvestments result:", result);
//     return result;
//   } catch (error: any) {
//     console.error("Error in processInvestments:", error);
//     if (typeof error === "object" && error !== null && "error" in error) {
//       throw new Error(error.error);
//     } else {
//       throw new Error("An unexpected error occurred");
//     }
//   }
// };

// const useProcessInvestments = (userId: string, runUntimed?: boolean) => {
//   console.log("useProcessInvestments called with:", { userId, runUntimed });

//   const { cachedData, setCachedData, clearCachedData } = useCachedDataStore();
//   console.log("Initial cachedData:", cachedData);

//   if (cachedData) {
//     const currentTime = new Date().getTime();
//     const cacheAge = currentTime - cachedData.timestamp;
//     const cacheAgeHumanReadable = formatDistanceToNow(
//       new Date(cachedData.timestamp)
//     );
//     const cacheDurationHumanReadable = formatDistanceToNow(
//       new Date(cachedData.timestamp + cachedData.cacheDuration)
//     );

//     console.log("Current time:", currentTime);
//     console.log("Cache age:", cacheAge, `(${cacheAgeHumanReadable} ago)`);
//     console.log(
//       "Cache duration:",
//       cachedData.cacheDuration,
//       `(expires in ${cacheDurationHumanReadable})`
//     );

//     if (cacheAge < cachedData.cacheDuration) {
//       // If cached data is within the cache duration, use it
//       console.log("Using cached data");
//       return { data: cachedData.data, isLoading: false, error: null };
//     } else {
//       // If cached data is older than the cache duration, clear the cache
//       console.log("Clearing outdated cache");
//       clearCachedData();
//     }
//   }

//   const queryResult = useSuspenseQuery({
//     queryKey: ["processInvestments-query", userId, runUntimed],
//     queryFn: fetchProcessInvestments,
//   });
//   console.log("Query result:", queryResult);

//   // Determine cache duration based on data
//   const data = queryResult.data;
//   console.log("Fetched data:", data);

//   const isAnyNonZero =
//     data.userBalance !== 0 ||
//     data.withdrawableBalance !== 0 ||
//     data.totalProfit !== 0 ||
//     data.totalWithdrawal !== 0;
//   const cacheDuration = isAnyNonZero ? 5 * 60 * 1000 : 30 * 1000;
//   console.log("Cache duration set to:", cacheDuration);

//   // Store data in Zustand cache with the determined duration
//   setCachedData(data, cacheDuration);
//   console.log("Data cached with duration:", { data, cacheDuration });

//   return queryResult;
// };

// export default useProcessInvestments;

// import { useSuspenseQuery } from "@tanstack/react-query";
// import { processInvestments } from "@/app/_action/supabase-core-clients";
// import { formatDistanceToNow } from "date-fns";
// import { useRouter } from "next/navigation";
// import { useCachedDataStore } from "../zuustand-store"; // Adjust the import path as necessary

// const fetchProcessInvestments = async ({
//   queryKey,
// }: {
//   queryKey: [string, string, boolean | undefined];
// }) => {
//   const [, userId, runUntimed] = queryKey;
//   console.log("fetchProcessInvestments called with:", { userId, runUntimed });

//   try {
//     const result = await processInvestments(userId, runUntimed);
//     console.log("processInvestments result:", result);
//     return result;
//   } catch (error: any) {
//     console.error("Error in processInvestments:", error);
//     if (typeof error === "object" && error !== null && "error" in error) {
//       throw new Error(error.error);
//     } else {
//       throw new Error("An unexpected error occurred");
//     }
//   }
// };

// const useProcessInvestments = (userId: string, runUntimed?: boolean) => {
//   console.log("useProcessInvestments called with:", { userId, runUntimed });

//   const { cachedData, setCachedData, clearCachedData, updateRedirectTime } =
//     useCachedDataStore();
//   const router = useRouter();
//   console.log("Initial cachedData:", cachedData);

//   if (cachedData) {
//     const currentTime = new Date().getTime();
//     const cacheAge = currentTime - cachedData.timestamp;
//     const cacheAgeHumanReadable = formatDistanceToNow(
//       new Date(cachedData.timestamp)
//     );
//     const cacheDurationHumanReadable = formatDistanceToNow(
//       new Date(cachedData.timestamp + cachedData.cacheDuration)
//     );

//     console.log("Current time:", currentTime);
//     console.log("Cache age:", cacheAge, `(${cacheAgeHumanReadable} ago)`);
//     console.log(
//       "Cache duration:",
//       cachedData.cacheDuration,
//       `(expires in ${cacheDurationHumanReadable})`
//     );

//     if (cacheAge < cachedData.cacheDuration) {
//       // If cached data is within the cache duration, use it
//       console.log("Using cached data");

//       // Check profit and redirect if conditions are met
//       const profitLast24Hours = cachedData.data.profitLast24Hours;
//       const lastRedirectTime = cachedData.lastRedirectTime || 0;
//       const fourHours = 4 * 60 * 60 * 1000;

//       if (profitLast24Hours > 0 && currentTime - lastRedirectTime > fourHours) {
//         updateRedirectTime(currentTime);
//         router.push(`/dashboard/congratulations?profit=${profitLast24Hours}`);
//       }

//       return { data: cachedData.data, isLoading: false, error: null };
//     } else {
//       // If cached data is older than the cache duration, clear the cache
//       console.log("Clearing outdated cache");
//       clearCachedData();
//     }
//   }

//   const queryResult = useSuspenseQuery({
//     queryKey: ["processInvestments-query", userId, runUntimed],
//     queryFn: fetchProcessInvestments,
//   });
//   console.log("Query result:", queryResult);

//   // Determine cache duration based on data
//   const data = queryResult.data;
//   console.log("Fetched data:", data);

//   const isAnyNonZero =
//     data.userBalance !== 0 ||
//     data.withdrawableBalance !== 0 ||
//     data.totalProfit !== 0 ||
//     data.totalWithdrawal !== 0;
//   const cacheDuration = isAnyNonZero ? 5 * 60 * 1000 : 30 * 1000;
//   console.log("Cache duration set to:", cacheDuration);

//   // Store data in Zustand cache with the determined duration
//   setCachedData(data, cacheDuration);
//   console.log("Data cached with duration:", { data, cacheDuration });

//   // Check profit and redirect if conditions are met
//   const currentTime = new Date().getTime();
//   const profitLast24Hours = data.profitLast24Hours;
//   const lastRedirectTime = cachedData?.lastRedirectTime || 0;
//   const fourHours = 4 * 60 * 60 * 1000;

//   if (profitLast24Hours > 0 && currentTime - lastRedirectTime > fourHours) {
//     updateRedirectTime(currentTime);
//     router.push(`/dashboard/congratulations?profit=${profitLast24Hours}`);
//   }

//   return queryResult;
// };

// export default useProcessInvestments;

import { processInvestments } from "@/app/_action/supabase-core-clients";
import { useCachedDataStore } from "../zuustand-store"; // Adjust the import path as necessary

const fetchProcessInvestments = async ({
  queryKey,
}: {
  queryKey: [string, string, boolean | undefined];
}) => {
  const [, userId, runUntimed] = queryKey;
  console.log("fetchProcessInvestments called with:", { userId, runUntimed });

  const state = useCachedDataStore.getState();
  const { cachedData, setCachedData, clearCachedData } = state;

  if (cachedData) {
    const currentTime = new Date().getTime();
    const cacheAge = currentTime - cachedData.timestamp;

    if (cacheAge < cachedData.cacheDuration) {
      // If cached data is within the cache duration, use it
      console.log("Using cached data");
      return cachedData.data;
    } else {
      // If cached data is older than the cache duration, clear the cache
      console.log("Clearing outdated cache");
      clearCachedData();
    }
  }

  try {
    const result = await processInvestments(userId, runUntimed);
    console.log("processInvestments result:", result);

    // Determine cache duration based on data
    const isAnyNonZero =
      result.userBalance !== 0 ||
      result.withdrawableBalance !== 0 ||
      result.totalProfit !== 0 ||
      result.totalWithdrawal !== 0;
    const cacheDuration = isAnyNonZero ? 5 * 60 * 1000 : 30 * 1000;
    console.log("Cache duration set to:", cacheDuration);

    // Store data in Zustand cache with the determined duration
    setCachedData(result, cacheDuration);
    console.log("Data cached with duration:", { result, cacheDuration });

    return result;
  } catch (error: any) {
    console.error("Error in processInvestments:", error);
    if (typeof error === "object" && error !== null && "error" in error) {
      throw new Error(error.error);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
// Adjust the import path as necessary

const useProcessInvestments = (userId: string, runUntimed?: boolean) => {
  console.log("useProcessInvestments called with:", { userId, runUntimed });

  const state = useCachedDataStore.getState();
  const { cachedData, updateRedirectTime } = state;
  const router = useRouter();
  console.log("Initial cachedData:", cachedData);

  const queryResult = useSuspenseQuery({
    queryKey: ["processInvestments-query", userId, runUntimed],
    queryFn: fetchProcessInvestments,
  });
  console.log("Query result:", queryResult);

  // Check profit and redirect if conditions are met
  const currentTime = new Date().getTime();
  const profitLast24Hours = queryResult.data.profitLast24Hours;
  const lastRedirectTime = cachedData?.lastRedirectTime || 0;
  const fourHours = 4 * 60 * 60 * 1000;

  if (profitLast24Hours > 0 && currentTime - lastRedirectTime > fourHours) {
    updateRedirectTime(currentTime);
    router.push(`/dashboard/congratulations?profit=${profitLast24Hours}`);
  }

  return queryResult;
};

export default useProcessInvestments;
