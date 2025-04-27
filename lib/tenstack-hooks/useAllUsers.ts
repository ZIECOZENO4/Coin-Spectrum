// useInvestments.ts
import { QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { useUserDataTableStore } from "../zuustand-store";
import {
  User,
  Investment,
  InvestmentPlan,
  InvestmentStatus,
} from "@prisma/client";

export type UsersResponse = {
  users: (User & {
    investments: (Investment & {
      plan: Pick<InvestmentPlan, "name">;
      status: InvestmentStatus | null;
    })[];
    confirmedInvestments: (Investment & {
      plan: Pick<InvestmentPlan, "name">;
      status: InvestmentStatus | null;
    })[];
    unconfirmedInvestments: (Investment & {
      plan: Pick<InvestmentPlan, "name">;
      status: InvestmentStatus | null;
    })[];
    totalConfirmedInvestmentAmount: number;
    totalUnconfirmedInvestmentAmount: number;
  })[];
  totalPages: number;
};

const fetchUsers = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<UsersResponse> => {
  const [_key, page, sort, order, search] = queryKey;
  const url = `/api/allUsers?page=${page}&sort=${sort}&order=${order}&search=${search}`;

  const response = await fetch(url);
  if (!response.ok) {
    const dataError = await response.json();
    throw new Error(dataError.error);
  }
  const data: UsersResponse = await response.json();
  return data;
};

export function useUsers(page: number, sort: string, order: string) {
  const { setPage, search } = useUserDataTableStore();
  useEffect(() => {
    setPage(1);
  }, [search]);
  return useSuspenseQuery<UsersResponse, Error>({
    queryKey: ["users", page, sort, order, search],
    queryFn: fetchUsers,
    staleTime: 60 * 60 * 1000 * 10,
    // 1 hour
    // keepPreviousData: true, // Uncomment if you want to keep the previous data while new data is being fetched
    // You can add more options here, such as `retry`, `onSuccess`, etc.
  });
}
