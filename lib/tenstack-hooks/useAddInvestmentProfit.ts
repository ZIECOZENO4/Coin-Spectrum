import { useMutation, useQueryClient } from "@tanstack/react-query";

async function addInvestmentProfit(data: { userInvestmentId: string; amount: number }): Promise<{ success: boolean; message: string }> {
  const response = await fetch("/api/admin/add-investment-profit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Send both userInvestmentId and amount
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add investment profit");
  }

  return response.json();
}

export function useAddInvestmentProfit() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string }, // Type of data returned by mutationFn on success
    Error, // Type of error
    { userInvestmentId: string; amount: number } // Type of variables passed to mutationFn
  >({
    mutationFn: addInvestmentProfit,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refetch data after successful payout
      queryClient.invalidateQueries({ queryKey: ["adminInvestments"] }); // Refetch the admin investments table
      queryClient.invalidateQueries({ queryKey: ["userStats"] }); // Refetch user stats to update total profits
      // Potentially invalidate a specific user's investment or balance if applicable
      // queryClient.invalidateQueries({ queryKey: ["userInvestmentDetails", variables.userInvestmentId] });
      alert(data.message || "Profit successfully added to user balance."); // Provide user feedback
    },
    onError: (error) => {
      console.error("Error adding investment profit:", error);
      alert(`Failed to add profit: ${error.message}`); // Provide user feedback
    },
  });
}
