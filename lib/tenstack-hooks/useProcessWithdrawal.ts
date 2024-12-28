import { formSchema } from "@/app/(user)/dashboard/withdraw/aside";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { z } from "zod";

interface ProcessWithdrawalVariables {
  userId: string;
  amount: number;
}

interface ProcessWithdrawalResult {
  success: boolean;
  message?: string;
}

const processWithdrawal = async (variables: z.infer<typeof formSchema>) => {
  console.log(
    `Calling process-withdrawal API with variables: ${JSON.stringify(
      variables
    )}`
  );
  const url = "/api/processWithdrawal";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(variables),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log("thsi is the error data to be logged", errorData);
    throw new Error(errorData.error || "Failed to process withdrawal");
  }

  const data: ProcessWithdrawalResult = await response.json();
  console.log(`Process-withdrawal API response: ${JSON.stringify(data)}`);
  return data;
};

export const useProcessWithdrawal = () => {
  return useMutation({
    mutationFn: processWithdrawal,
    mutationKey: ["processWithdrawal"],
  });
};
