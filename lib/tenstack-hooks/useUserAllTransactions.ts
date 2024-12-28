import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { TransactionHistory, TransactionType } from "@prisma/client";

type TransactionsResponse = {
  transactions: TransactionHistory[];
  totalPages: number;
};

const fetchTransactions = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const url = `/api/getUserHistory?page=${pageParam}`;

  const response = await fetch(url);
  if (!response.ok) {
    const dataError = await response.json();
    throw new Error(dataError.error);
  }
  const data: TransactionsResponse = await response.json();
  return data;
};

export function useUserAllTransactions() {
  return useSuspenseInfiniteQuery({
    queryKey: ["all-user-transactions"],
    queryFn: fetchTransactions,
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.totalPages) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
