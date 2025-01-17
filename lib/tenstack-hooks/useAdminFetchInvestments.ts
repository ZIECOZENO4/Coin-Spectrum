// lib/tenstack-hooks/useInvestments.ts
import { useQuery } from "@tanstack/react-query";

type Investment = {
  id: string;
  name: string;
  price: number;
  profitPercent: number;
  rating: number;
  principalReturn: boolean;
  principalWithdraw: boolean;
  creditAmount: number;
  depositFee: string;
  debitAmount: number;
  durationDays: number;
  createdAt: string;
  updatedAt: string;
};

type InvestmentResponse = {
  investments: Investment[];
  totalPages: number;
  currentPage: number;
};

export const useInvestments = (
  page: number,
  sort?: string,
  order?: string,
  search?: string,
  statusFilter?: string,
  planFilter?: string
) => {
  return useQuery<InvestmentResponse>({
    queryKey: ['investments', page, sort, order, search, statusFilter, planFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(sort && { sort }),
        ...(order && { order }),
        ...(search && { search }),
        ...(statusFilter && { statusFilter }),
        ...(planFilter && { planFilter }),
      });

      const response = await fetch(`/api/investments?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch investments');
      }
      return response.json();
    },
  });
};
