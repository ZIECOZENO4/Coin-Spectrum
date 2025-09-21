


import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

// Define proper types for the investment data
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
};

type InvestmentStatus = {
  id: string;
  status: string;
};

// Update the response type to match the API response
type UserInvestmentWithRelations = {
  id: string;
  userId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  investment: Investment | null;
  status: InvestmentStatus | null;
};

type InvestmentsResponse = {
  investments: UserInvestmentWithRelations[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
};

const fetchInvestments = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const response = await fetch(`/api/allAUserInvestment?page=${pageParam}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch investments' }));
    throw new Error(errorData.error || 'Failed to fetch investments');
  }
  
  const data = await response.json();
  
  // Validate the response structure
  if (!data || !Array.isArray(data.investments)) {
    throw new Error('Invalid response format');
  }
  
  return data as InvestmentsResponse;
};

export function useAUserAllInvestments() {
  return useSuspenseInfiniteQuery({
    queryKey: ["all-a-user-investment"],
    queryFn: fetchInvestments,
    getNextPageParam: (lastPage: InvestmentsResponse, allPages: InvestmentsResponse[]) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}
