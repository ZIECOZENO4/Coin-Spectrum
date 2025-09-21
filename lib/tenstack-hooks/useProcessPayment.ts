import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProcessPaymentData {
  userId: string;
  amount: number;
  paymentType: "profit" | "bonus";
  description?: string;
}

async function processPayment(data: ProcessPaymentData): Promise<{ success: boolean; message: string }> {
  const response = await fetch("/api/admin/process-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to process payment");
  }

  return response.json();
}

export function useProcessPayment() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    ProcessPaymentData
  >({
    mutationFn: processPayment,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refetch data after successful payment
      queryClient.invalidateQueries({ queryKey: ["userPayments"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminInvestments"] });
      alert(data.message || "Payment successfully processed.");
    },
    onError: (error) => {
      console.error("Error processing payment:", error);
      alert(`Failed to process payment: ${error.message}`);
    },
  });
}
