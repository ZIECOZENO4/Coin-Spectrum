// useInvestments.ts
import { QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { InvestmentStatusEnum, InvestmentPlanName } from "@prisma/client";
import { useEffect } from "react";
import {
  Investment,
  InvestmentStatus,
  InvestmentPlan,
  User,
} from "@prisma/client";
import { useDataTableStore } from "../zuustand-store";

export type InvestmentsResponse = {
  investments: (Investment & {
    user: User;
    plan: Pick<InvestmentPlan, "name">;
    status: {
      status: InvestmentStatusEnum | null;
    } | null;
    createdAt: string;
    updatedAt: string;
  })[];
  totalPages: number;
};

const fetchInvestments = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<InvestmentsResponse> => {
  const [_key, page, sort, order, search, statusFilter, planFilter] = queryKey;
  const url = `/api/allInvestment?page=${page}&sort=${sort}&order=${order}&search=${search}&statusFilter=${statusFilter}&planFilter=${planFilter}`;

  const response = await fetch(url);
  if (!response.ok) {
    const dataError = await response.json();
    throw new Error(dataError.error);
  }
  const data: InvestmentsResponse = await response.json();
  return data;
};

export function useInvestments(
  page: number,
  sort: string,
  order: string,
  search: string,
  statusFilter: InvestmentStatusEnum | "",
  planFilter: InvestmentPlanName | ""
) {
  const { setPage } = useDataTableStore();
  useEffect(() => {
    setPage(1);
  }, [search]);
  return useSuspenseQuery<InvestmentsResponse, Error>({
    queryKey: [
      "paginated-investments",
      page,
      sort,
      order,
      search,
      statusFilter,
      planFilter,
    ],
    queryFn: fetchInvestments,
    staleTime: 60 * 60 * 1000 * 10,
    // 1 hour
    // keepPreviousData: true, // Uncomment if you want to keep the previous data while new data is being fetched
    // You can add more options here, such as `retry`, `onSuccess`, etc.
  });
}
