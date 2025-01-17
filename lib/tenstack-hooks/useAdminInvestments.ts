import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib/tenstack-hooks/useInvestments.ts
export const useDeleteUserInvestment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (id: string) => {
        const response = await fetch(`/api/admin/investments?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete investment');
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['investments'] });
      },
    });
  };
  