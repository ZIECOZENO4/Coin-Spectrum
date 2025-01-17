// hooks/useTrades.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface TradePayload {
  symbol: string;
  type: 'BUY' | 'SELL';
  amount: number;
  leverage: string;
  expiry: string;
}

export const useTrades = () => {
  return useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const response = await fetch('/api/trades');
      if (!response.ok) throw new Error('Failed to fetch trades');
      return response.json();
    }
  });
};

export const useCreateTrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TradePayload) => {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create trade');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate both trades and user queries
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
};

export const useCloseTrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ tradeId }: { tradeId: string }) => {
      const response = await fetch('/api/trades/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to close trade');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
};
