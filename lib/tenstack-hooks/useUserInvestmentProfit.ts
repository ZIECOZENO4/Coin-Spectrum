import { useQuery } from '@tanstack/react-query';

// Define the expected shape of the API response
interface UserInvestmentProfitResponse {
  totalProfit: number;
  // Add other relevant fields from your API response if needed
}

// Define the function to fetch the data
const fetchUserInvestmentProfit = async (): Promise<UserInvestmentProfitResponse> => {
  const response = await fetch('/api/user/investment-profit'); // Using fetch
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch investment profit');
  }
  const data: UserInvestmentProfitResponse = await response.json();
  return data;
};

export const useUserInvestmentProfit = () => {
  return useQuery<UserInvestmentProfitResponse, Error>({
    queryKey: ['userInvestmentProfit'], // Unique key for this query
    queryFn: fetchUserInvestmentProfit,
    // Optional: configure staleTime, cacheTime, refetchOnWindowFocus, etc.
  });
};