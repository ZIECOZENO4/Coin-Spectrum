// lib/hooks/useInvestmentPlan.ts
import { InvestmentPlan } from "@prisma/client";
import { useQuery, UseQueryResult, useSuspenseQuery } from "@tanstack/react-query";

interface FetchInvestmentPlanError {
  error: string;
}

const fetchInvestmentPlan = async ({
  queryKey,
}: {
  queryKey: [string, string];
}): Promise<InvestmentPlan> => {
  const [, id] = queryKey;

  const response = await fetch(`/api/getAnInvestmentPlan?id=${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.error("Error response from server:", data);
    throw new Error(data.error || "An error occurred");
  }
  
  return data as InvestmentPlan;
};

export const useFetchOneInvestmentPlan = (id: string) => {
  return useSuspenseQuery({
    queryKey: ["an-investmentPlan", id],
    queryFn: fetchInvestmentPlan,
  });
};
