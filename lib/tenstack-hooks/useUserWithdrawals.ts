import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Withdrawal } from "@prisma/client";

type WithdrawalsResponse = {
  withdrawals: Withdrawal[];
  totalPages: number;
};

const fetchWithdrawals = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const url = `/api/allAUserWithdrawal?page=${pageParam}`;

  const response = await fetch(url);
  if (!response.ok) {
    const dataError = await response.json();
    throw new Error(dataError.error);
  }
  const data: WithdrawalsResponse = await response.json();
  return data;
};

export function useUserWithdrawals() {
  return useSuspenseInfiniteQuery({
    queryKey: ["user-withdrawals"],
    queryFn: fetchWithdrawals,
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.totalPages) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
