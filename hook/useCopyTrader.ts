// lib/hooks/useCopyTrader.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface CopyTradeData {
  traderId: string;
  amount: number;
}

export const useCopyTrader = () => {
  return useMutation({
    mutationFn: async (data: CopyTradeData) => {
      console.log("Starting copy trade process...", data);
      
      const response = await fetch("/api/copy-trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to copy trader");
      }

      const result = await response.json();
      console.log("Copy trade successful:", result);
      return result;
    },
    onSuccess: () => {
      toast.success("Successfully copied trader");
    },
    onError: (error: Error) => {
      console.error("Copy trade failed:", error);
      toast.error(error.message || "Failed to copy trader");
    }
  });
};
