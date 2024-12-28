import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Investment, InvestmentPlan, InvestmentStatus } from "@prisma/client";

type InvestmentsResponse = {
  investments: (Investment & {
    plan: InvestmentPlan;
    status: InvestmentStatus | null;
  })[];
  totalPages: number;
};

const fetchInvestments = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const url = `/api/allAUserInvestment?page=${pageParam}`;

  const response = await fetch(url);
  if (!response.ok) {
    const dataError = await response.json();
    throw new Error(dataError.error);
  }
  const data: InvestmentsResponse = await response.json();
  return data;
};

export function useAUserAllInvestments() {
  return useSuspenseInfiniteQuery({
    queryKey: ["all-a-user-investment"],
    queryFn: fetchInvestments,
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.totalPages) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
