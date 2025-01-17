// lib/hooks/useSignals.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignals = () => {
  return useQuery({
    queryKey: ['signals'],
    queryFn: async () => {
      const response = await fetch('/api/signals/purchase');
      if (!response.ok) throw new Error('Failed to fetch signals');
      return response.json();
    }
  });
};

export const usePurchaseSignal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ signalId }: { signalId: string }) => {
      const response = await fetch('/api/signals/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signalId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to purchase signal');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success("Signal purchased successfully!");
      queryClient.invalidateQueries({ queryKey: ['signals'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to purchase signal");
    }
  });
};
