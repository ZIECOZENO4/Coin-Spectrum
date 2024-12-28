import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { WithdrawalStatus } from "@prisma/client";
import { toast } from "sonner";

interface UpdateWithdrawalStatusInput {
  withdrawalId: string;
  status: WithdrawalStatus;
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  message: string;
}

const useUpdateWithdrawalStatus = (): UseMutationResult<
  SuccessResponse,
  Error,
  UpdateWithdrawalStatusInput
> => {
  const updateWithdrawalStatus = async (input: UpdateWithdrawalStatusInput) => {
    const { withdrawalId, status } = input;
    const url = `/api/updateWithdrawalStatus?id=${withdrawalId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error);
    }

    const data: SuccessResponse = await response.json();
    return data;
  };

  return useMutation<SuccessResponse, Error, UpdateWithdrawalStatusInput>({
    mutationFn: updateWithdrawalStatus,
    mutationKey: ["updateWithdrawalStatus"],
  });
};

export default useUpdateWithdrawalStatus;
