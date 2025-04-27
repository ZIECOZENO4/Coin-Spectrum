// useWithdrawals.ts
import { QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { WithdrawalStatus } from "@prisma/client";
import { useEffect } from "react";
import { useDataTableStore } from "../zuustand-store";
import { Withdrawal, User } from "@prisma/client";

export type WithdrawalsResponse = {
  withdrawals: (Withdrawal & {
    user: User;
    createdAt: string;
    updatedAt: string;
  })[];
  totalPages: number;
};

const fetchWithdrawals = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<WithdrawalsResponse> => {
  const [_key, page, sort, order, search, statusFilter] = queryKey;
  const url = `/api/allWithdrawals?page=${page}&sort=${sort}&order=${order}&search=${search}&statusFilter=${statusFilter}`;

  const response = await fetch(url);
  if (!response.ok) {
    const dataError = await response.json();
    throw new Error(dataError.error);
  }
  const data: WithdrawalsResponse = await response.json();
  return data;
};

export function useWithdrawals(
  page: number,
  sort: string,
  order: string,
  search: string,
  statusFilter: WithdrawalStatus | ""
) {
  const { setPage } = useDataTableStore();
  useEffect(() => {
    setPage(1);
  }, [search]);
  return useSuspenseQuery<WithdrawalsResponse, Error>({
    queryKey: ["withdrawals", page, sort, order, search, statusFilter],
    queryFn: fetchWithdrawals,
    staleTime: 60 * 60 * 1000 * 10,
    // 1 hour
    // keepPreviousData: true, // Uncomment if you want to keep the previous data while new data is being fetched
    // You can add more options here, such as `retry`, `onSuccess`, etc.
  });
}
