// lib/tenstack-hooks/useAdminFetchInvestments.ts
import { useQuery } from "@tanstack/react-query";
import { UserInvestmentData } from "@/app/(admin)/adminDashboard/allInvestments/DataTable";

type AdminInvestmentResponse = {
  investments: UserInvestmentData[];
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
  return useQuery<AdminInvestmentResponse>({
    queryKey: ['adminInvestments', page, sort, order, search, statusFilter, planFilter],
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
