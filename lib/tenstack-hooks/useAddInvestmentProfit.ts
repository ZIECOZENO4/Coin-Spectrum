import { useMutation, useQueryClient } from "@tanstack/react-query";

async function addInvestmentProfit(userInvestmentId: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch("/api/admin/add-investment-profit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userInvestmentId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add investment profit");
  }

  return response.json();
}

export function useAddInvestmentProfit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addInvestmentProfit,
    onSuccess: () => {
      // Invalidate relevant queries to refetch data after successful payout
      queryClient.invalidateQueries({ queryKey: ["adminInvestments"] }); // Refetch the admin investments table
      queryClient.invalidateQueries({ queryKey: ["userStats"] }); // Refetch user stats to update total profits
      // You might also want to invalidate the specific user's balance query if you have one
      // queryClient.invalidateQueries({ queryKey: ["userBalance"] });
      alert("Profit successfully added to user balance."); // Provide user feedback
    },
    onError: (error) => {
      console.error("Error adding investment profit:", error);
      alert(`Failed to add profit: ${error.message}`); // Provide user feedback
    },
  });
}
