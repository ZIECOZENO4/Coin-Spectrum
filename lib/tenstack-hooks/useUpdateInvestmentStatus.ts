import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { InvestmentStatusEnum } from "@prisma/client";
import { toast } from "sonner";

interface UpdateInvestmentStatusInput {
  investmentId: string;
  status: InvestmentStatusEnum;
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  message: string;
}

const useUpdateInvestmentStatus = (): UseMutationResult<
  SuccessResponse,
  Error,
  UpdateInvestmentStatusInput
> => {
  const updateInvestmentStatus = async (input: UpdateInvestmentStatusInput) => {
    const { investmentId, status } = input;
    const url = `/api/updateInvestmentStatus?id=${investmentId}`;
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

  return useMutation<SuccessResponse, Error, UpdateInvestmentStatusInput>({
    mutationFn: updateInvestmentStatus,
    mutationKey: ["updateInvestmentStatus"],
  });
};

export default useUpdateInvestmentStatus;
///fsf
