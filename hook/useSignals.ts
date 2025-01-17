// lib/hooks/useSignals.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
interface CreateSignalData {
    name: string;
    price: number;
    percentage: number;
    expiry: string;
    risk: "Low" | "Medium" | "High";
    description: string;
    isActive?: boolean;
  }
  
  
export const useSignals = () => {
  return useQuery({
    queryKey: ['signals'],
    queryFn: async () => {
      const response = await fetch('/api/signals');
      if (!response.ok) throw new Error('Failed to fetch signals');
      return response.json();
    }
  });
};

export const useCreateSignal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSignalData) => {
      const response = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create signal');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signals'] });
    }
  });
};

export const usePurchaseSignal = () => {
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
    }
  });
};
