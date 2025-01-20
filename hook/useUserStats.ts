// hooks/useUserStats.ts
import { useQuery } from "@tanstack/react-query";

interface UserStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
  totalTrades: number;
  netProfit: number;
}

async function fetchUserStats(): Promise<UserStats> {
  const response = await fetch("/api/user-stats");
  if (!response.ok) {
    throw new Error("Failed to fetch user stats");
  }
  return response.json();
}

export function useUserStats() {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
    staleTime: 30000,
    refetchInterval: 60000
  });
}
