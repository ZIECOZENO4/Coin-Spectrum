// hooks/useUserBalance.ts
import { useQuery } from "@tanstack/react-query";

async function fetchUserBalance() {
  const response = await fetch("/api/balance");
  if (!response.ok) {
    throw new Error("Failed to fetch balance");
  }
  const data = await response.json();
  return data.balance;
}

export function useUserBalance() {
  return useQuery({
    queryKey: ["userBalance"],
    queryFn: fetchUserBalance,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 60000 // Refetch every minute
  });
}
