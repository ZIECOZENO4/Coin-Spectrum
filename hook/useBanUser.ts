import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BanUserParams {
  userId: string;
  banned: boolean;
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, banned }: BanUserParams) => {
      const response = await fetch("/api/users/ban", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, banned }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user ban status");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error updating user ban status:", error);
    },
  });
}
