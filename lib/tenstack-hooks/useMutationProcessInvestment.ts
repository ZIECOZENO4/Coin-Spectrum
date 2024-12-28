import { processInvestments } from "@/app/_action/supabase-core-clients";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface ProcessInvestmentsInput {
  userId: string;
  runUntimed?: boolean;
}

const useProcessInvestments = () => {
  const processInvestmentsMutation = async (input: ProcessInvestmentsInput) => {
    const { userId, runUntimed } = input;

    try {
      const result = await processInvestments(userId, runUntimed);
      return result;
    } catch (error: any) {
      // Using `any` temporarily to access properties
      if (typeof error === "object" && error !== null && "error" in error) {
        throw new Error(error.error);
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  };

  return useMutation({
    mutationFn: processInvestmentsMutation,
    mutationKey: ["processInvestments-mutation"],
  });
};

export default useProcessInvestments;
