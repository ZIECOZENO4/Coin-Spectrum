import { useSuspenseQuery } from "@tanstack/react-query";
import { InvestmentPlan } from "@prisma/client";

// Create a new QueryClient instance

// Fetch function
const fetchInvestments = async () => {
  const response = await fetch("/api/getAllInvestments");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch investments");
  }
  const data: InvestmentPlan[] = await response.json();
  return data;
};

// Custom hook
export const useGetAllInvestmentPlans = () => {
  return useSuspenseQuery({
    queryKey: ["all-investments"],
    queryFn: fetchInvestments,
  });
};
