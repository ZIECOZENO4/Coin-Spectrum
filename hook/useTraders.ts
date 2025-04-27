// lib/hooks/useTraders.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Trader {
  id: string;
  name: string;
  image: string;
  followers: number;
  minCapital: number;
  percentageProfit: number;
  totalProfit: number;
  rating: number;
  isPro: boolean;
}

export const useTraders = () => {
  return useQuery({
    queryKey: ["traders"],
    queryFn: async (): Promise<Trader[]> => {
      const response = await fetch("/api/traders");
      if (!response.ok) {
        throw new Error("Failed to fetch traders");
      }
      const data = await response.json();
      return data.traders;
    }
  });
};
