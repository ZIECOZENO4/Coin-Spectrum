import { processInvestments } from "@/app/_action/supabase-core-clients";
import { useSuspenseQuery, UseQueryResult } from "@tanstack/react-query";

const fetchProcessInvestments = async ({
  queryKey,
}: {
  queryKey: [string, string, boolean | undefined];
}) => {
  const [, userId, runUntimed] = queryKey;

  try {
    const result = await processInvestments(userId, runUntimed);
    return result;
  } catch (error: any) {
    if (typeof error === "object" && error !== null && "error" in error) {
      throw new Error(error.error);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

const useProcessInvestments = (userId: string, runUntimed?: boolean) => {
  return useSuspenseQuery({
    queryKey: ["processInvestments-query", userId, runUntimed],
    queryFn: fetchProcessInvestments,
  });
};

export default useProcessInvestments;

//this is hte typescript type of what would be returned by the usesuspensequery
// const useProcessInvestments: (userId: string, runUntimed?: boolean) => UseSuspenseQueryResult<{
//     userBalance: number;
//     withdrawableBalance: number;
//     totalProfit: number;
//     totalWithdrawal: number;
// }, Error>
