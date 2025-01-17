// lib/hooks/usePendingWithdrawals.ts
import { useQuery } from "@tanstack/react-query";

interface PendingWithdrawal {
  id: string;
  amount: number;
  cryptoType: string;
  walletAddress: string;
  status: string;
  createdAt: Date;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const usePendingWithdrawals = () => {
  return useQuery({
    queryKey: ["pending-withdrawals"],
    queryFn: async (): Promise<PendingWithdrawal[]> => {
      const response = await fetch("/api/pending-withdrawals");
      if (!response.ok) {
        throw new Error("Failed to fetch pending withdrawals");
      }
      const data = await response.json();
      return data.withdrawals;
    }
  });
};
