// import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
// import { Investment, InvestmentPlan, InvestmentStatus } from "@prisma/client";

// type InvestmentsResponse = {
//   investments: (Investment & {
//     plan: InvestmentPlan;
//     status: InvestmentStatus | null;
//   })[];
//   totalPages: number;
// };

// const fetchInvestments = async ({ pageParam = 1 }: { pageParam?: number }) => {
//   const url = `/api/allAUserInvestment?page=${pageParam}`;

//   const response = await fetch(url);
//   if (!response.ok) {
//     const dataError = await response.json();
//     throw new Error(dataError.error);
//   }
//   const data: InvestmentsResponse = await response.json();
//   return data;
// };

// export function useAUserAllInvestments() {
//   return useSuspenseInfiniteQuery({
//     queryKey: ["all-a-user-investment"],
//     queryFn: fetchInvestments,
//     getNextPageParam: (lastPage, pages) => {
//       if (pages.length < lastPage.totalPages) {
//         return pages.length + 1;
//       }
//       return undefined;
//     },
//     initialPageParam: 1,
//   });
// }


import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

// Define proper types for the investment data
type Investment = {
  id: string;
  userId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

type InvestmentPlan = {
  id: string;
  name: string;
  description: string;
};

type InvestmentStatus = {
  id: string;
  status: string;
};

// Update the response type to match the API response
type InvestmentWithRelations = {
  id: string;
  userId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  plan: InvestmentPlan | null;
  status: InvestmentStatus | null;
};

type InvestmentsResponse = {
  investments: InvestmentWithRelations[];
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
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}
