// hooks/useUserInvestments.ts
import { useQuery } from '@tanstack/react-query';
import { User, Investment, UserInvestment } from '@/lib/db/schema';

interface FetchedInvestment extends UserInvestment {
  user: Pick<User, 'fullName' | 'email'>;
  investment: Pick<Investment, 'name' | 'price' | 'profitPercent' | 'durationDays'>;
}

interface InvestmentsResponse {
  investments: FetchedInvestment[];
  totalPages: number;
  currentPage: number;
}

export function useUserInvestments(page: number, search: string) {
  return useQuery<InvestmentsResponse>({
    queryKey: ['userInvestments', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
      });
      
      const response = await fetch(`/api/user-investments?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch investments');
      }
      
      return response.json();
    },
  });
}
